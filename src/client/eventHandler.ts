import { ClientEvents } from 'discord.js';
import { ClientSettings } from './clientSettings';
import { BotContext, Logger, Event, EventContext, EventHook, HookStage } from '..';
import { eventContext } from '../context';

/**
 * If ctx.skip, then skip, else run the hook
 */
function hookOrSkip<K extends keyof ClientEvents, DB>(ctx: EventContext<K, DB>, hook: EventHook<K, DB>) {
	if (ctx.skip) return ctx;
	return hook(ctx);
}

/**
 * A hook to set the stage of the context
 */
function setStage<K extends keyof ClientEvents, DB>(stage: HookStage) {
	return (ctx: EventContext<K, DB>) => Promise.resolve({
		...ctx,
		stage
	})
}

// Handle calling an individual event handler for its event
async function handleEvent<K extends keyof ClientEvents, DB>(
	bot: BotContext<DB>,
	event: ClientEvents[K],
	handler: Event<K, DB>,
	logger: Logger,
	settings: ClientSettings<DB>
) {
	// Create the event context
	const ctx = eventContext(event, bot, logger, settings);

	// Handle an encountered error
	const handleError = async (e: any) => {
		// Use error hooks by default, else just log it
		if (typeof handler.error === 'undefined' || handler.error.length < 1) {
			await ctx.logError(e);
		} else {
			try {
				// Let the error hooks handle the error
				await handler.error.reduce(
					(chain, hook) => chain.then((ctx) => hook(ctx)),
					Promise.resolve({
						...ctx,
						error: e,
						stage: 'error',
					} as EventContext<K, DB>),
				);
			} catch (err) {
				// If the error hooks threw another error, log the error
				await ctx.logError(err);
			}
		}
	};

	// Handle the hooks and the event handler itself
	await (handler.before ?? []).reduce(
		(chain, hook) => chain.then(ctx => hookOrSkip(ctx, hook)),
		Promise.resolve(ctx))
		.then(setStage('handler'))
		.then(ctx => hookOrSkip(ctx, handler.handler))
		.then(setStage('after'))
		.then(ctx => (handler.after ?? []).reduce(
			(chain, hook) => chain.then(ctx => hookOrSkip(ctx, hook)),
			Promise.resolve(ctx)
		)).catch(handleError)
}

/**
 *  Create an event handler function, returns a handler function for the given event type
 */
export default function eventHandler<K extends keyof ClientEvents, DB>(
	type: K,
	events: Event<K, DB>[],
	bot: BotContext<DB>,
	logger: Logger,
	settings: ClientSettings<DB>
) {
	// filter out all events that are not of the given type
	const registered = events.filter((value) => value.on === type);

	// Return the handler function
	return async (...event: ClientEvents[K]) => {
		for (const handler of registered) {
			await handleEvent(bot, event, handler, logger, settings);
		}
	};
}
