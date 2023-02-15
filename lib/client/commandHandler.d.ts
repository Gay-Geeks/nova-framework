import { ChatInputCommandInteraction } from 'discord.js';
import { ClientSettings } from './clientSettings';
import { BotContext, Command, Logger } from '..';
/**
 *  Uploads all the commands of the bot to discord as slash-commands
 */
export declare function uploadCommands<DB>(token: string, client_id: string, bot: BotContext<DB>): Promise<void>;
/**
 * The command handler, it returns a function that should be called with an incoming command interaction to handle it.
 */
export default function commandHandler<DB>(commands: Command<DB>[], bot: BotContext<DB>, logger: Logger, settings: ClientSettings<DB>): (interaction: ChatInputCommandInteraction) => Promise<void>;
//# sourceMappingURL=commandHandler.d.ts.map