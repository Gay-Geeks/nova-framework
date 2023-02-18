import { CommandHook } from '..';
/**
 * Checks if the command was already ran by the same user within the last x seconds as provided by the param.
 * If it was, it throws an error if provided, or else sets ctx.skip to true.
 * If the ctx.getPermissionLevel method returns a number higher than the given bypass param, or the command was ran in dms, this cooldown is ignored
 */
export declare function cooldown<DB = undefined>(seconds: number, error?: any, bypass?: number): CommandHook<DB>;
//# sourceMappingURL=cooldown.d.ts.map