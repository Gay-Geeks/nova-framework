import { ClientOptions, GuildMember } from 'discord.js';
import { CommandHook, LoggerConfiguration } from '..';

/**
 * Hooks that get added before all other hooks on all commands
 */
export interface OnAllCommands<DB> {
	before?: CommandHook<DB>[];
	after?: CommandHook<DB>[];
	error?: CommandHook<DB>[];
}

/**
 * The Settings that can be provided to the Client when setting it up
 */
export interface ClientSettings<DB> {
	token: string;
	database: DB;
	clientOptions?: ClientOptions;
	loggerOptions?: LoggerConfiguration;
	onAllCommands?: OnAllCommands<DB>;
	loadDatabaseEntities?: (database: DB, paths: string[]) => Promise<void>;
	getConfig?: () => unknown;
	getPermissionLevel: (member: GuildMember) => Promise<number>;
}
