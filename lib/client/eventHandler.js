"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../context");
// Handle calling an individual event handler for its event
async function handleEvent(bot, event, handler, logger, settings) {
    // Create the event context
    const ctx = (0, context_1.eventContext)(event, bot, logger, settings);
    // Handle an encountered error
    const handleError = async (e) => {
        // Use error hooks by default, else just log it
        if (typeof handler.error === 'undefined' || handler.error.length < 1) {
            await ctx.logError(e);
        }
        else {
            try {
                // Let the error hooks handle the error
                await handler.error.reduce((chain, hook) => chain.then((ctx) => hook(ctx)), Promise.resolve({
                    ...ctx,
                    error: e,
                    stage: 'error',
                }));
            }
            catch (err) {
                // If the error hooks threw another error, log the error
                await ctx.logError(err);
            }
        }
    };
    // Call the event handler
    await (handler.before
        ? // Call the before hooks of the event handler if they exist
            handler.before.reduce((chain, hook) => chain.then((ctx) => hook(ctx)), Promise.resolve(ctx))
        : Promise.resolve(ctx))
        .then((ctx) => ctx.skip
        ? Promise.resolve(ctx)
        : // Call the event handler itself if it hasn't been skipped
            handler.handler({
                ...ctx,
                stage: 'handler',
            }))
        .then((ctx) => !ctx.skip && handler.after
        ? // If there are after hooks and they haven't been skipped, call the after hooks
            handler.after.reduce((chain, hook) => chain.then((ctx) => hook(ctx)), Promise.resolve({
                ...ctx,
                stage: 'after',
            }))
        : Promise.resolve(ctx))
        // If any error was thrown, handle the error
        .catch(handleError);
}
/**
 *  Create an event handler function, returns a handler function for the given event type
 */
function eventHandler(type, events, bot, logger, settings) {
    // filter out all events that are not of the given type
    const registered = events.filter((value) => value.on === type);
    // Return the handler function
    return async (...event) => {
        for (const handler of registered) {
            await handleEvent(bot, event, handler, logger, settings);
        }
    };
}
exports.default = eventHandler;
//# sourceMappingURL=eventHandler.js.map