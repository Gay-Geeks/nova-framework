"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipCommandHooksIfError = exports.skipEventHooksIfError = void 0;
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