import { ClientEvents, GuildMember } from 'discord.js';
import { BotContext, EventContext, Logger } from '..';
import { ClientSettings } from '../client';

function getPermissionLevel<DB>(settings: ClientSettings<DB>) {
	return (member: GuildMember) => {
		if (typeof settings.getPermissionLevel === 'function') {
			return settings.getPermissionLevel(member);
		}
		return Promise.resolve(0)
	}
}

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
		getPermissionLevel: getPermissionLevel(settings),
		getConfig: settings.getConfig,
		...logger
	};
}
