import { ClientOptions, GuildMember } from 'discord.js';
import { CommandHook, Context, Logger, LoggerConfiguration } from '..';
/**
 * Hooks that get added before all other hooks on all commands
 */
export interface OnAllCommands<DB> {
    before?: CommandHook<DB>[];
    after?: CommandHook<DB>[];
    error?: CommandHook<DB>[];
}
/**
 * The Settings that can be provided to the Client when setting it up.
 * It is advised to not build this directly, but to use the ClientBuilder
 */
export interface ClientSettings<DB> {
    token: string;
    database?: DB;
    clientOptions?: ClientOptions;
    loggerOptions?: LoggerConfiguration;
    onAllCommands?: OnAllCommands<DB>;
    modulePaths?: string[];
    loadDatabaseEntities?: (database: DB, paths: string[], logger: Logger) => Promise<void>;
    setupDatabase?: (entityPaths: string[], logger: Logger) => Promise<DB>;
    getConfig?: () => unknown;
    getPermissionLevel: (ctx: Context<DB>, member: GuildMember) => Promise<number>;
}
//# sourceMappingURL=clientSettings.d.ts.map