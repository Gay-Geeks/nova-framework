import { CommandHook, EventHook } from '..';
/**
 * Checks if the command was ran inside a guild.
 * If not, it throws an error if provided, or else sets ctx.skip to true
 */
export declare function inGuild<DB = undefined>(error?: any): CommandHook<DB>;
/**
 * Checks if the message was posted inside a guild.
 * If not, it throws an error if provided, or else sets ctx.skip to true
 */
export declare function messageInGuild<DB = undefined>(error?: any): EventHook<'messageCreate', DB>;
//# sourceMappingURL=inGuild.d.ts.map