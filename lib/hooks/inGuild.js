/* eslint-disable @typescript-eslint/require-await */
export function inGuild(error = null) {
    return async (ctx) => {
        if (!ctx.interaction.guild) {
            if (error) {
                throw error;
            }
            ctx.skip = true;
        }
        return ctx;
    };
}
export function messageInGuild(error = null) {
    return async (ctx) => {
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
//# sourceMappingURL=inGuild.js.map