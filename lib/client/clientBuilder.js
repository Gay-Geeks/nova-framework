"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientBuilder = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
/**
 * A helper class to make constructing the ClientSettings easier and clearer
 */
class ClientBuilder {
    constructor(token) {
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.settings = {
            token,
            modulePaths: [],
            getPermissionLevel: () => Promise.resolve(0),
            clientOptions: {
                intents: [
                    discord_js_1.GatewayIntentBits.Guilds,
                    discord_js_1.GatewayIntentBits.DirectMessages,
                    discord_js_1.GatewayIntentBits.GuildMessages
                ]
            }
        };
    }
    setClientOptions(options) {
        this.settings.clientOptions = options;
        return this;
    }
    setIntents(intents) {
        this.settings.clientOptions.intents = intents;
        return this;
    }
    setLoggerOptions(loggerConfig) {
        this.settings.loggerOptions = loggerConfig;
        return this;
    }
    setErrorLogChannel(channelId) {
        if (this.settings.loggerOptions) {
            this.settings.loggerOptions.errorLogChannel = channelId;
        }
        else {
            this.settings.loggerOptions = { errorLogChannel: channelId };
        }
        return this;
    }
    setDefaultLogChannel(channelId) {
        if (this.settings.loggerOptions) {
            this.settings.loggerOptions.defaultLogChannel = channelId;
        }
        else {
            this.settings.loggerOptions = { defaultLogChannel: channelId };
        }
        return this;
    }
    setOnAllCommands(onAll) {
        this.settings.onAllCommands = onAll;
        return this;
    }
    setDefaultCommandErrorHooks(hooks) {
        if (this.settings.onAllCommands) {
            this.settings.onAllCommands.error = hooks;
        }
        else {
            this.settings.onAllCommands = { error: hooks };
        }
        return this;
    }
    addModulePaths(...modules) {
        this.settings.modulePaths = this.settings.modulePaths.concat(modules);
        return this;
    }
    setLoadDatabaseEntities(loader) {
        this.settings.loadDatabaseEntities = loader;
        return this;
    }
    setSetupDatabase(setupFunc) {
        this.settings.setupDatabase = setupFunc;
        return this;
    }
    setGetConfig(getter) {
        this.settings.getConfig = getter;
        return this;
    }
    setGetPermissionLevel(getter) {
        this.settings.getPermissionLevel = getter;
        return this;
    }
    /**
     * Build the client with the ClientSettings that have been constructed.
     * Returns the BotContext and the Logger
     */
    async build() {
        return (0, __1.client)(this.settings);
    }
}
exports.ClientBuilder = ClientBuilder;
//# sourceMappingURL=clientBuilder.js.map