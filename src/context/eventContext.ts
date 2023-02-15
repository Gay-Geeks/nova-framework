import { ClientEvents, GuildMember } from 'discord.js';
import { BotContext, Context, EventContext, Logger } from '..';
import { ClientSettings } from '../client';

export default function eventContext<K extends keyof ClientEvents, DB>(
	event: ClientEvents[K],
	bot: BotContext<DB>,
	logger: Logger,
	settings: ClientSettings<DB>
): EventContext<K, DB> {
	return {
		event,
		bot,
		stage: 'before',
		getConfig: settings.getConfig,
		...logger,
		getPermissionLevel: function (this: Context<DB>, member: GuildMember) {
			return settings.getPermissionLevel(this, member)
		},
	};
}
