import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ApplicationCommandOptionChoiceData, ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { ClientSettings } from './clientSettings';
import { BotContext, Command, CommandContext, CommandHook, Logger } from '..';
import { commandContext } from '../context';

function hookOrSkip<DB>(ctx: CommandContext<DB>, hook: CommandHook<DB>) {
	if (ctx.skip) return ctx;
	return hook(ctx);
}

// Loads the choises by either returning undefined if undefined,
// or else calling it with the bot context as the argument
function loadChoices<DB>(
	bot: BotContext<DB>,
	choicesLoader?: (bot: BotContext<DB>) => Promise<ApplicationCommandOptionChoiceData[]>,
): Promise<ApplicationCommandOptionChoiceData[] | undefined> {
	if (!choicesLoader) {
		return Promise.resolve(undefined);
	}

	return choicesLoader(bot);
}

/**
 *  Uploads all the commands of the bot to discord as slash-commands
 */
export async function uploadCommands<DB>(token: string, client: Client, bot: BotContext<DB>) {
	// Get a rest api client
	const rest = new REST().setToken(token);

	// Transform all of our command objects to the format discord uses
	const discord_commands = (
		await Promise.all(
			bot.commands.map(async (c: Command<DB>) => {
				const cmd = new SlashCommandBuilder()
					.setName(c.name)
					.setDescription(c.description)
					.setDefaultMemberPermissions(c.permission_level === 0 ? undefined : "0")
					.toJSON()
				cmd.options = c.options
					? await Promise.all(
							c.options.map(async (o) => ({
								...o,
								type: o.type as number,
								// Load choices if any have been registered for this command
								choices: await loadChoices(bot, c.optionChoices ? c.optionChoices[o.name] : undefined),
							})),
						)
					: undefined
				return cmd
			}),
		)
	);

	// Upload the commands to discord and get the returned objects as ApplicationCommands
	await rest.put(Routes.applicationCommands(client.user!.id), {
		body: discord_commands,
	});
}

// Run a command based on the given interaction and given the bot context
async function runCommand<DB>(command: Command<DB>, interaction: ChatInputCommandInteraction, bot: BotContext<DB>, logger: Logger, settings: ClientSettings<DB>) {
	// Create the command context
	const ctx = commandContext(interaction, command.name, bot, logger, settings);

	// Handle an encountered error
	const handleError = async (e: any) => {
		// Default to the standard error handlers if no error hooks have been registered
		if (typeof command.error === 'undefined' || command.error.length < 1) {
			// Just log if error is anything else
			await ctx.logError(e);
		} else {
			try {
				// Let the error hooks handle the error
				await command.error.reduce(
					(chain, hook) => chain.then(hook),
					Promise.resolve({
						...ctx,
						error: e,
						stage: 'error',
					} as CommandContext<DB>),
				);
			} catch (err) {
				// If the error hooks threw another error, log the error
				await ctx.logError(err);
			}
		}
	};

	// Call the commands
	await (command.before
		? // Call the before hooks of the command if they exist
		  command.before.reduce((chain, hook) => chain.then(ctx => hookOrSkip(ctx, hook)), Promise.resolve(ctx))
		: Promise.resolve(ctx)
	)
		.then((ctx) =>
			ctx.skip
				? Promise.resolve(ctx)
				: // Call the command itself is it hasn't been skipped
				  command.command({
						...ctx,
						stage: 'handler',
				  } as CommandContext<DB>),
		)
		.then((ctx) =>
			!ctx.skip && command.after
				? // If there are after hooks and they haven't been skipped, call the after hooks
				  command.after.reduce(
						(chain, hook) => chain.then(ctx => hookOrSkip(ctx, hook)),
						Promise.resolve({
							...ctx,
							stage: 'after',
						} as CommandContext<DB>),
				  )
				: ctx,
		)
		// If any error was thrown, handle the error
		.catch(handleError);
}

/**
 * The command handler, it returns a function that should be called with an incoming command interaction to handle it.
 */
export default function commandHandler<DB>(commands: Command<DB>[], bot: BotContext<DB>, logger: Logger, settings: ClientSettings<DB>) {
	// Makes the list of commands into a map, to be able to index it by the command name
	const commandMap = commands.reduce<{ [key: string]: Command<DB> }>((all, command) => {
		all[command.name] = command;
		return all;
	}, {});

	// The command interaction handler
	return async (interaction: ChatInputCommandInteraction) => {
		const commandUsed = commandMap[interaction.commandName];
		if (typeof commandUsed === 'undefined') {
			return;
		}

		await runCommand(commandUsed, interaction, bot, logger, settings);
	};
}
