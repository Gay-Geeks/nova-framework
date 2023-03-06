"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreBotMessages = void 0;
/**
 * Checks if the message was posted by a bot.
 * If it was, it throws an error if provided, or else sets ctx.skip to true
 */
function ignoreBotMessages(error = null) {
    // eslint-disable-next-line @typescript-eslint/require-await
    return async (ctx) => {
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
exports.ignoreBotMessages = ignoreBotMessages;
//# sourceMappingURL=ignoreBotMessages.js.map