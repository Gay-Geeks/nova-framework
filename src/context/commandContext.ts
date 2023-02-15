import { EmbedBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { BotContext, CommandContext, Context, Logger, ReplyOptions } from '..';
import { ClientSettings } from '../client';

/**
 * Reply to the interaction that triggered the command
 */
async function reply(this: CommandContext, content?: string | EmbedBuilder, options?: ReplyOptions) {
	const isEmbed = typeof content === 'object';
	const opts = {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		embeds: isEmbed ? [content as EmbedBuilder] : undefined,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		content: isEmbed || !content ? undefined : (content as string),
		files: options?.files,
		ephemeral: options?.ephemeral,
		stickers: options?.stickers,
		components: options?.components,
	};
	await this.interaction.reply(opts);

	if (options?.autoDelete) {
		setTimeout(() => void this.interaction.deleteReply(), 8000);
	}

	return options?.returnReply ? this.interaction.fetchReply() : null;
}

/**
 * Create a CommandContext object;
 * holds information about the command and some useful methods
 */
export default function commandContext<DB>(
	interaction: ChatInputCommandInteraction,
	command: string,
	bot: BotContext<DB>,
	logger: Logger,
	settings: ClientSettings<DB>
): CommandContext<DB> {
	return {
		interaction,
		commandUsed: command,
		bot,
		stage: 'before',
		getConfig: settings.getConfig,
		reply,
		...logger,
		getPermissionLevel: function (this: Context<DB>, member: GuildMember) {
			return settings.getPermissionLevel(this, member)
		},
	};
}
