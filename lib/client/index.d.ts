import { ClientSettings } from './clientSettings';
import { BotContext, Logger } from '..';
export { ClientBuilder } from './clientBuilder';
export type { ClientSettings };
/**
 * Creates the bot client and loads everything needed for it.
 * It is advised to not call this directly, but to use the ClientBuilder to create the ClientSettings in an easier way.
 * Returns the BotContext and the Logger
 */
export declare function client<DB>(settings: ClientSettings<DB>): Promise<[BotContext<DB>, Logger]>;
//# sourceMappingURL=index.d.ts.map