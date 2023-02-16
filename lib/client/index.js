"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.ClientBuilder = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const commandHandler_1 = tslib_1.__importStar(require("./commandHandler"));
const eventHandler_1 = tslib_1.__importDefault(require("./eventHandler"));
const loadModules_1 = tslib_1.__importDefault(require("./loadModules"));
const botContext_1 = tslib_1.__importDefault(require("../context/botContext"));
const logging_1 = require("../logging");
var clientBuilder_1 = require("./clientBuilder");
Object.defineProperty(exports, "ClientBuilder", { enumerable: true, get: function () { return clientBuilder_1.ClientBuilder; } });
/**
 * Creates the bot client and loads everything needed for it.
 */
async function client(settings) {
    // Create the discord client
    const client = new discord_js_1.Client(settings.clientOptions ?? {
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.DirectMessages,
            discord_js_1.GatewayIntentBits.GuildMessages
        ],
    });
    // Setup the logger
    const logger = (0, logging_1.createLogger)(client, settings.loggerOptions ?? {});
    // Load all the modules from their directories
    const modules = await (0, loadModules_1.default)(logger, settings);
    // Load database entities
    if (settings.database && typeof settings.loadDatabaseEntities === 'function') {
        await settings.loadDatabaseEntities(settings.database, modules.entities, logger);
    }
    else if (settings.setupDatabase) {
        settings.database = await settings.setupDatabase(modules.entities, logger);
    }
    // Create the bot context which will be passed to all command and event handlers
    const bot = (0, botContext_1.default)(settings, client, modules.commands);
    // Create the command handler and have it listen to incoming command interactions
    const handleCommand = (0, commandHandler_1.default)(modules.commands, bot, logger, settings);
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        await handleCommand(interaction).catch((error) => logger.logError(error));
    });
    // Create an event listener and handler for every event that we want to listen to
    const eventNames = new Set(modules.events.map((e) => e.on));
    for (const eventName of eventNames) {
        client.on(eventName, async (...args) => {
            await (0, eventHandler_1.default)(eventName, modules.events, bot, logger, settings)(...args).catch((error) => logger.logError(error));
        });
    }
    bot.events.on('reloadCommands', () => void (0, commandHandler_1.uploadCommands)(settings.token, client.user.id, bot).catch((error) => logger.logError(error)));
    // On ready reload our commands, uploading them to discord and load all the members we can see to our database
    client.on('ready', () => {
        bot.events.emit('reloadCommands');
    });
    // Return the created bot and logger
    return [bot, logger];
}
exports.client = client;
//# sourceMappingURL=index.js.map