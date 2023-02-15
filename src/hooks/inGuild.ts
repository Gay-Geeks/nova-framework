/* eslint-disable @typescript-eslint/require-await */

import { CommandHook, CommandContext, EventHook, EventContext } from '..';

export function inGuild<DB = undefined>(error: any = null): CommandHook<DB> {
	return async (ctx: CommandContext<DB>) => {
		if (!ctx.interaction.guild) {
			if (error) {
				throw error;
			}
			ctx.skip = true;
		}
		return ctx;
	};
}

export function messageInGuild<DB = undefined>(error: any = null): EventHook<'messageCreate', DB> {
	return async (ctx: EventContext<'messageCreate', DB>) => {
		const [message] = ctx.event;
		if (!message.guild) {
			if (error) {
				throw error;
			}
			ctx.skip = true;
		}
		return ctx;
	};
}
