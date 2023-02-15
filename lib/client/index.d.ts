import { Client } from 'discord.js';
import { ClientSettings } from './clientSettings';
export { ClientBuilder } from './clientBuilder';
export type { ClientSettings };
/**
 * Creates the bot client and loads everything needed for it.
 */
export declare function client<DB>(settings: ClientSettings<DB>): Promise<Client<boolean>>;
//# sourceMappingURL=index.d.ts.map