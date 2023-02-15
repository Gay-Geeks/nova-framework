import { ChatInputCommandInteraction } from 'discord.js';
import { BotContext, CommandContext, Logger } from '..';
import { ClientSettings } from '../client';
/**
 * Create a CommandContext object;
 * holds information about the command and some useful methods
 */
export default function commandContext<DB>(interaction: ChatInputCommandInteraction, command: string, bot: BotContext<DB>, logger: Logger, settings: ClientSettings<DB>): CommandContext<DB>;
//# sourceMappingURL=commandContext.d.ts.map