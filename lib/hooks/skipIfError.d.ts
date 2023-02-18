import { ClientEvents } from 'discord.js';
import { CommandHook, EventHook } from '../types';
/**
 * Runs the provided EventHook and if it throws an error, catch it and set ctx.skip to true
 */
export declare function skipEventHooksIfError<E extends keyof ClientEvents, DB>(hook: EventHook<E, DB>): EventHook<E, DB>;
/**
 * Runs the provided CommandHook and if it throws an error, catch it and set ctx.skip to true
 */
export declare function skipCommandHooksIfError<DB>(hook: CommandHook<DB>): CommandHook<DB>;
//# sourceMappingURL=skipIfError.d.ts.map