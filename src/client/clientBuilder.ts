import { BitFieldResolvable, ClientOptions, GatewayIntentBits, GatewayIntentsString, GuildMember, Snowflake } from 'discord.js';
import { ClientSettings, OnAllCommands } from './clientSettings';
import { BotContext, client, CommandHook, Context, Logger, LoggerConfiguration } from '..';

/**
 * A helper class to make constructing the ClientSettings easier and clearer
 */
export class ClientBuilder<DB> {
	private readonly settings: ClientSettings<DB>;

	public constructor(token: string) {
		this.settings = {
			token,
			modulePaths: [],
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

	public addModulePaths(...modules: string[]) {
		this.settings.modulePaths = this.settings.modulePaths!.concat(modules)
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

	public setGetPermissionLevel(getter: (ctx: Context<DB>, member: GuildMember) => Promise<number>) {
		this.settings.getPermissionLevel = getter;
		return this;
	}

	/**
	 * Build the client with the ClientSettings that have been constructed.
	 * Returns the BotContext and the Logger
	 */
	public async build(): Promise<[BotContext<DB>, Logger]> {
		return client(this.settings)
	}
}
