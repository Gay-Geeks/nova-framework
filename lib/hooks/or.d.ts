import { ClientEvents } from 'discord.js';
import { CommandHook, EventHook } from '..';
export declare function commandOr<DB = undefined>(hook1: CommandHook<DB>, hook2: CommandHook<DB>): CommandHook<DB>;
export declare function eventOr<K extends keyof ClientEvents, DB = undefined>(hook1: EventHook<K, DB>, hook2: EventHook<K, DB>): EventHook<K, DB>;
//# sourceMappingURL=or.d.ts.map