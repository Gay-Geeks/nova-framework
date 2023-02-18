"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cooldown = void 0;
/**
 * Checks if the command was already ran by the same user within the last x seconds as provided by the param.
 * If it was, it throws an error if provided, or else sets ctx.skip to true.
 * If the ctx.getPermissionLevel method returns a number higher than the given bypass param, or the command was ran in dms, this cooldown is ignored
 */
function cooldown(seconds, error = null, bypass = 3) {
    const history = [];
    // eslint-disable-next-line @typescript-eslint/require-await
    return async (ctx) => {
        const member = ctx.interaction.member;
        if (member === null) {
            return ctx;
        }
        if (await ctx.getPermissionLevel(member) >= bypass) {
            return ctx;
        }
        const last = history.find((c) => c.user === member.id);
        if (!last) {
            history.push({
                user: member.id,
                last: new Date(),
            });
            return ctx;
        }
        const limit = new Date();
        limit.setSeconds(limit.getSeconds() - seconds);
        if (limit < last.last) {
            if (error) {
                throw error;
            }
            ctx.skip = true;
            return ctx;
        }
        last.last = new Date();
        return ctx;
    };
}
exports.cooldown = cooldown;
//# sourceMappingURL=cooldown.js.map