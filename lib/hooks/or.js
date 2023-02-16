"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventOr = exports.commandOr = void 0;
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
            ret = await hook2(ctx);
        }
        return ret;
    };
}
exports.commandOr = commandOr;
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
            ret = await hook2(ctx);
        }
        return ret;
    };
}
exports.eventOr = eventOr;
//# sourceMappingURL=or.js.map