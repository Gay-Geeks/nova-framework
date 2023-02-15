import { EventEmitter } from 'events';
import { schedule } from 'node-cron';
import { Command, BotContext } from '..'
import { ClientSettings } from '../client';

/**
 * Create a BotContext object;
 * holds the database connection, list of commands, an events emitter and scheduler
 */
export default function createBotContext<DB>(settings: ClientSettings<DB>, commands: Command<DB>[]): BotContext<DB> {
	return {
		db: settings.database!,
		commands,
		schedule,
		events: new EventEmitter()
	};
}
