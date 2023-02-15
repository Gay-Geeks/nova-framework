import { Command, BotContext } from '..';
import { ClientSettings } from '../client';
/**
 * Create a BotContext object;
 * holds the database connection, list of commands, an events emitter and scheduler
 */
export default function createBotContext<DB>(settings: ClientSettings<DB>, commands: Command<DB>[]): BotContext<DB>;
//# sourceMappingURL=botContext.d.ts.map