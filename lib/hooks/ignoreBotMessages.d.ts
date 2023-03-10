import { EventHook } from '..';
/**
 * Checks if the message was posted by a bot.
 * If it was, it throws an error if provided, or else sets ctx.skip to true
 */
export declare function ignoreBotMessages<DB = undefined>(error?: any): EventHook<'messageCreate', DB>;
//# sourceMappingURL=ignoreBotMessages.d.ts.map