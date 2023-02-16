import { ClientSettings } from './clientSettings';
import { BotContext, Logger } from '..';
export { ClientBuilder } from './clientBuilder';
export type { ClientSettings };
/**
 * Creates the bot client and loads everything needed for it.
 */
export declare function client<DB>(settings: ClientSettings<DB>): Promise<[BotContext<DB>, Logger]>;
//# sourceMappingURL=index.d.ts.map