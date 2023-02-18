"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipCommandHooksIfError = exports.skipEventHooksIfError = void 0;
/**
 * Runs the provided EventHook and if it throws an error, catch it and set ctx.skip to true
 */
function skipEventHooksIfError(hook) {
    return async (ctx) => {
        try {
            return await hook(ctx);
        }
        catch (err) {
            ctx.skip = true;
            return ctx;
        }
    };
}
exports.skipEventHooksIfError = skipEventHooksIfError;
/**
 * Runs the provided CommandHook and if it throws an error, catch it and set ctx.skip to true
 */
function skipCommandHooksIfError(hook) {
    return async (ctx) => {
        try {
            return await hook(ctx);
        }
        catch (err) {
            ctx.skip = true;
            return ctx;
        }
    };
}
exports.skipCommandHooksIfError = skipCommandHooksIfError;
//# sourceMappingURL=skipIfError.js.map