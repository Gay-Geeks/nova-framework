import { ClientEvents } from 'discord.js';
import { CommandContext, EventContext } from '../types';

export function skipIfError<DB, C extends EventContext<keyof ClientEvents, DB> | CommandContext<DB>>(hook: (ctx: C) => Promise<C>) {
	return async (ctx: C) => {
		try {
			return await hook(ctx);
		} catch (err) {
			ctx.skip = true;
			return ctx;
		}
	};
}
