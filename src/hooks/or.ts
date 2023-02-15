import { ClientEvents } from 'discord.js';
import { CommandHook, CommandContext, EventHook, EventContext } from '..';

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
			ret = await hook2(ctx);
		}
		return ret;
	};
}

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
			ret = await hook2(ctx);
		}
		return ret;
	};
}
