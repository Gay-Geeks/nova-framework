import { GatewayIntentBits } from 'discord.js';
import { client } from '..';
export class ClientBuilder {
    constructor(token) {
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.settings = {
            token,
            getPermissionLevel: () => Promise.resolve(0),
            clientOptions: {
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.DirectMessages,
                    GatewayIntentBits.GuildMessages
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
    async build() {
        return client(this.settings);
    }
}
//# sourceMappingURL=clientBuilder.js.map