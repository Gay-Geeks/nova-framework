/* eslint-disable @typescript-eslint/require-await */

import { CommandHook, CommandContext, EventHook, EventContext } from '..';

/**
 * Checks if the command was ran inside a guild.
 * If not, it throws an error if provided, or else sets ctx.skip to true
 */
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

/**
 * Checks if the message was posted inside a guild.
 * If not, it throws an error if provided, or else sets ctx.skip to true
 */
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
