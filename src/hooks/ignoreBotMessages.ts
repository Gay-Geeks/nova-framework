import { EventContext, EventHook } from '..';

/**
 * Checks if the message was posted by a bot.
 * If it was, it throws an error if provided, or else sets ctx.skip to true
 */
export function ignoreBotMessages<DB = undefined>(error: any = null): EventHook<'messageCreate', DB> {
	// eslint-disable-next-line @typescript-eslint/require-await
	return async (ctx: EventContext<'messageCreate', DB>) => {
		const [message] = ctx.event;
		if (message.author.bot) {
			if (error) {
				throw error;
			}
			ctx.skip = true;
		}
		return ctx;
	};
}
