import { BitFieldResolvable, ClientOptions, GatewayIntentsString, GuildMember, Snowflake } from 'discord.js';
import { OnAllCommands } from './clientSettings';
import { BotContext, CommandHook, Context, Logger, LoggerConfiguration } from '..';
/**
 * A helper class to make constructing the ClientSettings easier and clearer
 */
export declare class ClientBuilder<DB> {
    private readonly settings;
    constructor(token: string);
    setClientOptions(options: ClientOptions): this;
    setIntents(intents: BitFieldResolvable<GatewayIntentsString, number>): this;
    setLoggerOptions(loggerConfig: LoggerConfiguration): this;
    setErrorLogChannel(channelId: Snowflake): this;
    setDefaultLogChannel(channelId: Snowflake): this;
    setOnAllCommands(onAll: OnAllCommands<DB>): this;
    setDefaultCommandErrorHooks(hooks: CommandHook<DB>[]): this;
    addModulePaths(...modules: string[]): this;
    setLoadDatabaseEntities(loader: (database: DB, paths: string[], logger: Logger) => Promise<void>): this;
    setSetupDatabase(setupFunc: (entityPaths: string[], logger: Logger) => Promise<DB>): this;
    setGetConfig(getter: () => unknown): this;
    setGetPermissionLevel(getter: (ctx: Context<DB>, member: GuildMember) => Promise<number>): this;
    /**
     * Build the client with the ClientSettings that have been constructed.
     * Returns the BotContext and the Logger
     */
    build(): Promise<[BotContext<DB>, Logger]>;
}
//# sourceMappingURL=clientBuilder.d.ts.map