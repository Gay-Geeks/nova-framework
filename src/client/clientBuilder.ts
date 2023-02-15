import { BitFieldResolvable, Client, ClientOptions, GatewayIntentBits, GatewayIntentsString, GuildMember, Snowflake } from 'discord.js';
import { ClientSettings, OnAllCommands } from './clientSettings';
import { client, CommandHook, Logger, LoggerConfiguration } from '..';

export class ClientBuilder<DB> {
	private readonly settings: ClientSettings<DB>;

	public constructor(token: string) {
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

	public setClientOptions(options: ClientOptions) {
		this.settings.clientOptions = options;
		return this;
	}

	public setIntents(intents: BitFieldResolvable<GatewayIntentsString, number>) {
		this.settings.clientOptions!.intents = intents;
		return this;
	}

	public setLoggerOptions(loggerConfig: LoggerConfiguration) {
		this.settings.loggerOptions = loggerConfig;
		return this;
	}

	public setErrorLogChannel(channelId: Snowflake) {
		if (this.settings.loggerOptions) {
			this.settings.loggerOptions.errorLogChannel = channelId;
		} else {
			this.settings.loggerOptions = {errorLogChannel: channelId};
		}
		return this;
	}

	public setDefaultLogChannel(channelId: Snowflake) {
		if (this.settings.loggerOptions) {
			this.settings.loggerOptions.defaultLogChannel = channelId;
		} else {
			this.settings.loggerOptions = {defaultLogChannel: channelId};
		}
		return this;
	}

	public setOnAllCommands(onAll: OnAllCommands<DB>) {
		this.settings.onAllCommands = onAll;
		return this;
	}

	public setDefaultCommandErrorHooks(hooks: CommandHook<DB>[]) {
		if (this.settings.onAllCommands) {
			this.settings.onAllCommands.error = hooks;
		} else {
			this.settings.onAllCommands = {error: hooks}
		}
		return this;
	}

	public setLoadDatabaseEntities(loader: (database: DB, paths: string[], logger: Logger) => Promise<void>) {
		this.settings.loadDatabaseEntities = loader;
		return this;
	}

	public setSetupDatabase(setupFunc: (entityPaths: string[], logger: Logger) => Promise<DB>) {
		this.settings.setupDatabase = setupFunc;
		return this;
	}

	public setGetConfig(getter: () => unknown) {
		this.settings.getConfig = getter;
		return this;
	}

	public setGetPermissionLevel(getter: (member: GuildMember) => Promise<number>) {
		this.settings.getPermissionLevel = getter;
		return this;
	}

	public async build(): Promise<Client> {
		return client(this.settings)
	}
}
