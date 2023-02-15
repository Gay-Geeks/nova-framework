/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access */
import * as promises from 'fs/promises';
import { join } from 'path';
const MODULE_PATHS = [
    join(__dirname, '..', 'modules'),
    join('.', 'modules')
];
const jsFileRegex = /.+\.js$/;
// Loads all commands from their files in the command directory of the module
async function loadCommands(path, module, logger) {
    const commands = [];
    for (const commandFile of await promises.readdir(path)) {
        if (jsFileRegex.test(commandFile)) {
            const cmd = require(join(path, commandFile)).default;
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
}
;
// Loads all event handlers from their files in the events directory of the module
async function loadEvents(path, logger) {
    const events = [];
    for (const eventFile of await promises.readdir(path)) {
        if (jsFileRegex.test(eventFile)) {
            const event = require(join(path, eventFile)).default;
            if (typeof event !== 'object' || typeof event.handler !== 'function') {
                await logger.logError(`No event has been defined in ${path}`);
                continue;
            }
            events.push(event);
        }
    }
    return events;
}
;
function addDefaultCommandHooks(onAllCommands, commands) {
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
export default async function loadModules(logger, settings) {
    const commands = [];
    const events = [];
    const entities = [];
    for (const module_path of MODULE_PATHS) {
        try {
            for (const module of await promises.readdir(module_path)) {
                await logger.logToFile('default', `loading module ${module}`);
                try {
                    const moduleParts = await promises.readdir(join(module_path, module, 'src'));
                    for (const part of moduleParts) {
                        if (part === 'commands') {
                            commands.push(...(await loadCommands(join(module_path, module, 'src', part), module, logger)));
                        }
                        else if (part === 'events') {
                            events.push(...(await loadEvents(join(module_path, module, 'src', part), logger)));
                        }
                        else if (part === 'entities') {
                            entities.push(join(module_path, module, 'src', part, '*.js'));
                        }
                    }
                }
                catch (e) {
                    await logger.logError(`failed to load ${module}:\n${e.stack}`);
                    continue;
                }
            }
        }
        catch (_) {
            continue;
        }
    }
    if (commands.length < 1 && events.length < 1) {
        await logger.logError(`No commands or event handlers have been found!\nThe following directories were checked: ${MODULE_PATHS.join(',')}`);
    }
    if (settings.onAllCommands) {
        addDefaultCommandHooks(settings.onAllCommands, commands);
    }
    return {
        commands,
        events,
        entities,
    };
}
//# sourceMappingURL=loadModules.js.map