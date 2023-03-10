import { EventEmitter } from 'events';
import { Client } from 'discord.js';
import { schedule } from 'node-cron';
import { Command, BotContext } from '..'
import { ClientSettings } from '../client';

/**
 * Create a BotContext object;
 * holds the database connection, list of commands, an events emitter and scheduler
 */
export default function createBotContext<DB>(settings: ClientSettings<DB>, client: Client, commands: Command<DB>[]): BotContext<DB> {
	return {
		client,
		commands,
		schedule,
		db: settings.database!,
		events: new EventEmitter(),

		guilds: client.guilds,
		users: client.users,
		channels: client.channels,
		emojis: client.emojis,

		login: function (this, token?: string) {
			return this.client.login(token ?? settings.token)
		},
		destroy: function (this) {
			return this.client.destroy()
		}
	};
}
