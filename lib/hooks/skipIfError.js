"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipIfError = void 0;
function skipIfError(hook) {
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
exports.skipIfError = skipIfError;
//# sourceMappingURL=skipIfError.js.map