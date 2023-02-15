export function commandOr(hook1, hook2) {
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
export function eventOr(hook1, hook2) {
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
//# sourceMappingURL=or.js.map