import { ClientEvents } from 'discord.js';
import { CommandHook, CommandContext, EventHook, EventContext } from '..';

/**
 * Runs the first CommandHook and if it errors or sets ctx.skip to true, runs the second as well.
 * This ignores the error or skip of the first in such a case in favor of the second CommandHook
 */
export function commandOr<DB = undefined>(hook1: CommandHook<DB>, hook2: CommandHook<DB>): CommandHook<DB> {
	return async (ctx: CommandContext<DB>) => {
		let ret = ctx;
		try {
			ret = await hook1(ctx);
		} catch (err) {
			ret = await hook2(ctx);
			return ret;
		}
		if (ret.skip) {
			ret.skip = false
			ret = await hook2(ctx);
		}
		return ret;
	};
}

/**
 * Runs the first EventHook and if it errors or sets ctx.skip to true, runs the second as well.
 * This ignores the error or skip of the first in such a case in favor of the second EventHook
 */
export function eventOr<K extends keyof ClientEvents, DB = undefined>(
	hook1: EventHook<K, DB>,
	hook2: EventHook<K, DB>
): EventHook<K, DB> {
	return async (ctx: EventContext<K, DB>) => {
		let ret = ctx;
		try {
			ret = await hook1(ctx);
		} catch (err) {
			ret = await hook2(ctx);
			return ret;
		}
		if (ret.skip) {
			ret.skip = false
			ret = await hook2(ctx);
		}
		return ret;
	};
}
