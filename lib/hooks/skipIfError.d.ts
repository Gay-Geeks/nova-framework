import { ClientEvents } from 'discord.js';
import { CommandContext, EventContext } from '../types';
export declare function skipIfError<DB, C extends EventContext<keyof ClientEvents, DB> | CommandContext<DB>>(hook: (ctx: C) => Promise<C>): (ctx: C) => Promise<C>;
//# sourceMappingURL=skipIfError.d.ts.map