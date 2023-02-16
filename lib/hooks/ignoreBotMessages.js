"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreBotMessages = void 0;
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