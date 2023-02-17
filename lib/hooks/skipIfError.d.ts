import { ClientEvents } from 'discord.js';
import { CommandHook, EventHook } from '../types';
export declare function skipEventHooksIfError<E extends keyof ClientEvents, DB>(hook: EventHook<E, DB>): EventHook<E, DB>;
export declare function skipCommandHooksIfError<DB>(hook: CommandHook<DB>): CommandHook<DB>;
//# sourceMappingURL=skipIfError.d.ts.map