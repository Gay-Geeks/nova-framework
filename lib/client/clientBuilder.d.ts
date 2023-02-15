import { BitFieldResolvable, Client, ClientOptions, GatewayIntentsString, GuildMember, Snowflake } from 'discord.js';
import { OnAllCommands } from './clientSettings';
import { CommandHook, LoggerConfiguration } from '..';
export declare class ClientBuilder<DB> {
    private readonly settings;
    constructor(token: string, database: DB);
    setClientOptions(options: ClientOptions): this;
    setIntents(intents: BitFieldResolvable<GatewayIntentsString, number>): this;
    setLoggerOptions(loggerConfig: LoggerConfiguration): this;
    setErrorLogChannel(channelId: Snowflake): this;
    setDefaultLogChannel(channelId: Snowflake): this;
    setOnAllCommands(onAll: OnAllCommands<DB>): this;
    setDefaultCommandErrorHooks(hooks: CommandHook<DB>[]): this;
    setLoadDatabaseEntities(loader: (database: DB, paths: string[]) => Promise<void>): this;
    setGetConfig(getter: () => unknown): this;
    setGetPermissionLevel(getter: (member: GuildMember) => Promise<number>): this;
    build(): Promise<Client>;
}
//# sourceMappingURL=clientBuilder.d.ts.map