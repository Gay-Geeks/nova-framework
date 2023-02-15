import { EventContext, EventHook } from '..';

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
