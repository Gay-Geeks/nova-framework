import { ClientEvents } from 'discord.js';
import { CommandContext, CommandHook, EventContext, EventHook } from '../types';

/**
 * Runs the provided EventHook and if it throws an error, catch it and set ctx.skip to true
 */
export function skipEventHooksIfError<
	E extends keyof ClientEvents,
	DB,
>(hook: EventHook<E, DB>): EventHook<E, DB> {
	return async (ctx: EventContext<E, DB>): Promise<EventContext<E, DB>> => {
		try {
			return await hook(ctx);
		} catch (err) {
			ctx.skip = true;
			return ctx;
		}
	};
}

/**
 * Runs the provided CommandHook and if it throws an error, catch it and set ctx.skip to true
 */
export function skipCommandHooksIfError<DB>(hook: CommandHook<DB>): CommandHook<DB> {
	return async (ctx: CommandContext<DB>): Promise<CommandContext<DB>> => {
		try {
			return await hook(ctx);
		} catch (err) {
			ctx.skip = true;
			return ctx;
		}
	};
}
