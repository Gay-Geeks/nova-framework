/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access */

import * as promises from 'fs/promises';
import { join } from 'path';
import { ClientEvents } from 'discord.js';
import { ClientSettings, OnAllCommands } from './clientSettings';
import { Command, Event, Logger } from '..';

const jsFileRegex = /.+\.js$/;

// Loads all commands from their files in the command directory of the module
async function loadCommands<DB>(path: string, module: string, logger: Logger): Promise<Command<DB>[]>{
	const commands: Command<DB>[] = [];
	for (const commandFile of await promises.readdir(path)) {
		if (jsFileRegex.test(commandFile)) {
			const cmd = require(join(path, commandFile)).default as Command<DB> | undefined;
			if (typeof cmd !== 'object' || typeof cmd.command !== 'function') {
				await logger.logError(`No command has been defined in ${path}`);
				continue;
			}
			if (typeof cmd.name !== 'string' || cmd.name.length > 32 || cmd.name.length < 1) {
				await logger.logError(`The command in ${path} has an invalid name, command names must be between 1 and 100 characters`);
				continue;
			}
			if (typeof cmd.description !== 'string' || cmd.description.length > 100 || cmd.description.length < 1) {
				await logger.logError(`The command in ${path} has an invalid description, command dexcriptions must be between 1 and 100 characters`);
				continue;
			}

			cmd.category = cmd.category ?? module;
			commands.push(cmd);
		}
	}
	return commands;
};

// Loads all event handlers from their files in the events directory of the module
async function loadEvents<DB>(path: string, logger: Logger): Promise<Event<keyof ClientEvents, DB>[]> {
	const events: Event<keyof ClientEvents, DB>[] = [];
	for (const eventFile of await promises.readdir(path)) {
		if (jsFileRegex.test(eventFile)) {
			const event = require(join(path, eventFile)).default as Event<keyof ClientEvents, DB> | undefined;
			if (typeof event !== 'object' || typeof event.handler !== 'function') {
				await logger.logError(`No event has been defined in ${path}`);
				continue;
			}

			events.push(event);
		}
	}
	return events;
};

function addDefaultCommandHooks<DB>(onAllCommands: OnAllCommands<DB>, commands: Command<DB>[]) {
	for (const command of commands) {
		if (onAllCommands.before) {
			command.before = command.before ? onAllCommands.before.concat(command.before) : onAllCommands.before;
		}
		if (onAllCommands.after) {
			command.after = command.after ? onAllCommands.after.concat(command.after) : onAllCommands.after;
		}
		if (onAllCommands.error) {
			command.error = command.error ? onAllCommands.error.concat(command.error) : onAllCommands.error;
		}
	}
}

/**
 * Loads all modules into the bot. This goes through the module path and treats every directory in it as a module.
 * In a module, all js files in the commands directory are loaded as commands,
 * all in the events directory as event handlers and all in the entities directory as database entities.
 */
export default async function loadModules<DB>(logger: Logger, settings: ClientSettings<DB>) {
	const commands: Command<DB>[] = [];
	const events: Event<keyof ClientEvents, DB>[] = [];
	const entities: string[] = [];

	let all_paths = settings.modulePaths
	if (!all_paths) {
		all_paths = [join('.', 'src')]
	}

	for (const module_path of all_paths) {
		try {
			for (const module of await promises.readdir(module_path, { withFileTypes: true })) {
				try {
					if (!module.isDirectory()) {
						continue;
					}

					const srcPart = module.name === 'src' ? '.' : 'src';

					await logger.logToFile('default', `loading module ${module.name}`);

					const moduleParts = await promises.readdir(join(module_path, module.name, srcPart));
					for (const part of moduleParts.map(p => p.toLowerCase())) {
						if (part === 'commands') {
							commands.push(...(await loadCommands<DB>(join(module_path, module.name, srcPart, part), module.name, logger)));
							await logger.logToFile('default', `loaded commands of ${module.name}`);
						} else if (part === 'events') {
							events.push(...(await loadEvents<DB>(join(module_path, module.name, srcPart, part), logger)));
							await logger.logToFile('default', `loaded events of ${module.name}`);
						} else if (part === 'entities') {
							entities.push(join(module_path, module.name, srcPart, part, '*.js'));
							await logger.logToFile('default', `loaded entities of ${module.name}`);
						}
					}
				} catch (e) {
					await logger.logError(`failed to load ${module.name}:\n${(e as Error).stack!}`);
					continue;
				}
			}
		} catch (_) {
			continue;
		}
	}

	if (commands.length < 1 && events.length < 1) {
		await logger.logError(`No commands or event handlers have been found!\nThe following directories were checked: ${all_paths.join(',')}`);
	}

	if (settings.onAllCommands){
		addDefaultCommandHooks(settings.onAllCommands, commands);
	}

	return {
		commands,
		events,
		entities,
	};
}
