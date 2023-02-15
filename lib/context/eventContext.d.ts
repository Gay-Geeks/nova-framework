import { ClientEvents } from 'discord.js';
import { BotContext, EventContext, Logger } from '..';
import { ClientSettings } from '../client';
export default function eventContext<K extends keyof ClientEvents, DB>(event: ClientEvents[K], bot: BotContext<DB>, logger: Logger, settings: ClientSettings<DB>): EventContext<K, DB>;
//# sourceMappingURL=eventContext.d.ts.map