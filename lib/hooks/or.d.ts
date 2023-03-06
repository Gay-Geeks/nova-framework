import { ClientEvents } from 'discord.js';
import { CommandHook, EventHook } from '..';
/**
 * Runs the first CommandHook and if it errors or sets ctx.skip to true, runs the second as well.
 * This ignores the error or skip of the first in such a case in favor of the second CommandHook
 */
export declare function commandOr<DB = undefined>(hook1: CommandHook<DB>, hook2: CommandHook<DB>): CommandHook<DB>;
/**
 * Runs the first EventHook and if it errors or sets ctx.skip to true, runs the second as well.
 * This ignores the error or skip of the first in such a case in favor of the second EventHook
 */
export declare function eventOr<K extends keyof ClientEvents, DB = undefined>(hook1: EventHook<K, DB>, hook2: EventHook<K, DB>): EventHook<K, DB>;
//# sourceMappingURL=or.d.ts.map