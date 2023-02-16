import { Client, ClientEvents, GatewayIntentBits, Interaction } from 'discord.js';
import { ClientSettings } from './clientSettings';
import commandHandler, { uploadCommands } from './commandHandler';
import eventHandler from './eventHandler';
import loadModules from './loadModules';
import { BotContext, Logger } from '..';
import createBotContext from '../context/botContext';
import { createLogger } from '../logging';

export { ClientBuilder } from './clientBuilder';
export type { ClientSettings };

/**
 * Creates the bot client and loads everything needed for it.
 */
export async function client<DB>(settings: ClientSettings<DB>): Promise<[BotContext<DB>, Logger]> {
	// Create the discord client
	const client = new Client(settings.clientOptions ?? {
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.GuildMessages
		],
	});

	// Setup the logger
	const logger = createLogger(client, settings.loggerOptions ?? {})

	// Load all the modules from their directories
	const modules = await loadModules<DB>(logger, settings);

	// Load database entities
	if (settings.database && typeof settings.loadDatabaseEntities === 'function') {
		await settings.loadDatabaseEntities(settings.database, modules.entities, logger);
	} else if (settings.setupDatabase) {
		settings.database = await settings.setupDatabase(modules.entities, logger);
	}

	// Create the bot context which will be passed to all command and event handlers
	const bot = createBotContext(settings, client, modules.commands);

	// Create the command handler and have it listen to incoming command interactions
	const handleCommand = commandHandler(modules.commands, bot, logger, settings);
	client.on('interactionCreate', async (interaction: Interaction) => {
		if (!interaction.isChatInputCommand()) return;

		await handleCommand(interaction).catch((error) => logger.logError(error));
	});

	// Create an event listener and handler for every event that we want to listen to
	const eventNames = new Set(modules.events.map((e) => e.on));
	for (const eventName of eventNames) {
		client.on(eventName, async (...args: ClientEvents[keyof ClientEvents]) => {
			await eventHandler(
				eventName,
				modules.events,
				bot,
				logger,
				settings
			)(...args).catch((error) => logger.logError(error));
		});
	}

	bot.events.on(
		'reloadCommands',
		() => void uploadCommands(settings.token, client.user!.id, bot).catch((error) => logger.logError(error)),
	);

	// On ready reload our commands, uploading them to discord and load all the members we can see to our database
	client.on('ready', () => {
		bot.events.emit('reloadCommands');
	});

	// Return the created bot and logger
	return [bot, logger];
}
