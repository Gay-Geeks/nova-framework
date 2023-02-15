export function ignoreBotMessages(error = null) {
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
//# sourceMappingURL=ignoreBotMessages.js.map