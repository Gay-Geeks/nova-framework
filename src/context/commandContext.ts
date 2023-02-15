import { EmbedBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { BotContext, CommandContext, Logger, ReplyOptions } from '..';
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

function getPermissionLevel<DB>(settings: ClientSettings<DB>) {
	return (member: GuildMember) => {
		if (typeof settings.getPermissionLevel === 'function') {
			return settings.getPermissionLevel(member);
		}
		return Promise.resolve(0)
	}
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
		getPermissionLevel: getPermissionLevel(settings),
		getConfig: settings.getConfig,
		reply,
		...logger
	};
}
