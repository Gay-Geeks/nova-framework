import { ClientEvents } from 'discord.js';
import { ClientSettings } from './clientSettings';
import { BotContext, Logger, Event } from '..';
/**
 *  Create an event handler function, returns a handler function for the given event type
 */
export default function eventHandler<K extends keyof ClientEvents, DB>(type: K, events: Event<K, DB>[], bot: BotContext<DB>, logger: Logger, settings: ClientSettings<DB>): (...event: ClientEvents[K]) => Promise<void>;
//# sourceMappingURL=eventHandler.d.ts.map