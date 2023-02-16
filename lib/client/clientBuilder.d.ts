import { BitFieldResolvable, Client, ClientOptions, GatewayIntentsString, GuildMember, Snowflake } from 'discord.js';
import { OnAllCommands } from './clientSettings';
import { CommandHook, Context, Logger, LoggerConfiguration } from '..';
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
    build(): Promise<Client>;
}
//# sourceMappingURL=clientBuilder.d.ts.map