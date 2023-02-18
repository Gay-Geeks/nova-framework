"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../context");
/**
 * If ctx.skip, then skip, else run the hook
 */
function hookOrSkip(ctx, hook) {
    if (ctx.skip)
        return ctx;
    return hook(ctx);
}
/**
 * A hook to set the stage of the context
 */
function setStage(stage) {
    return (ctx) => Promise.resolve({
        ...ctx,
        stage
    });
}
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
    // Handle the hooks and the event handler itself
    await (handler.before ?? []).reduce((chain, hook) => chain.then(ctx => hookOrSkip(ctx, hook)), Promise.resolve(ctx))
        .then(setStage('handler'))
        .then(ctx => hookOrSkip(ctx, handler.handler))
        .then(setStage('after'))
        .then(ctx => (handler.after ?? []).reduce((chain, hook) => chain.then(ctx => hookOrSkip(ctx, hook)), Promise.resolve(ctx))).catch(handleError);
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