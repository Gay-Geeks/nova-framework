"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventOr = exports.commandOr = void 0;
/**
 * Runs the first CommandHook and if it errors or sets ctx.skip to true, runs the second as well.
 * This ignores the error or skip of the first in such a case in favor of the second CommandHook
 */
function commandOr(hook1, hook2) {
    return async (ctx) => {
        let ret = ctx;
        try {
            ret = await hook1(ctx);
        }
        catch (err) {
            ret = await hook2(ctx);
            return ret;
        }
        if (ret.skip) {
            ret.skip = false;
            ret = await hook2(ctx);
        }
        return ret;
    };
}
exports.commandOr = commandOr;
/**
 * Runs the first EventHook and if it errors or sets ctx.skip to true, runs the second as well.
 * This ignores the error or skip of the first in such a case in favor of the second EventHook
 */
function eventOr(hook1, hook2) {
    return async (ctx) => {
        let ret = ctx;
        try {
            ret = await hook1(ctx);
        }
        catch (err) {
            ret = await hook2(ctx);
            return ret;
        }
        if (ret.skip) {
            ret.skip = false;
            ret = await hook2(ctx);
        }
        return ret;
    };
}
exports.eventOr = eventOr;
//# sourceMappingURL=or.js.map