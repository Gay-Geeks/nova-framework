"use strict";
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promises = tslib_1.__importStar(require("fs/promises"));
const path_1 = require("path");
const jsFileRegex = /.+\.js$/;
// Loads all commands from their files in the command directory of the module
async function loadCommands(path, module, logger) {
    const commands = [];
    for (const commandFile of await promises.readdir(path)) {
        if (jsFileRegex.test(commandFile)) {
            const cmd = require((0, path_1.join)(path, commandFile)).default;
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
            const event = require((0, path_1.join)(path, eventFile)).default;
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
async function loadModules(logger, settings) {
    const commands = [];
    const events = [];
    const entities = [];
    let all_paths = settings.modulePaths;
    if (!all_paths) {
        all_paths = [(0, path_1.join)('.', 'src')];
    }
    for (const module_path of all_paths) {
        try {
            for (const module of await promises.readdir(module_path)) {
                try {
                    const srcPart = module === 'src' ? '.' : 'src';
                    const stat = await promises.stat((0, path_1.join)(module_path, module, srcPart));
                    if (!stat.isDirectory()) {
                        continue;
                    }
                    await logger.logToFile('default', `loading module ${module}`);
                    const moduleParts = await promises.readdir((0, path_1.join)(module_path, module, srcPart));
                    for (const part of moduleParts.map(p => p.toLowerCase())) {
                        if (part === 'commands') {
                            commands.push(...(await loadCommands((0, path_1.join)(module_path, module, srcPart, part), module, logger)));
                            await logger.logToFile('default', `loaded commands of ${module}`);
                        }
                        else if (part === 'events') {
                            events.push(...(await loadEvents((0, path_1.join)(module_path, module, srcPart, part), logger)));
                            await logger.logToFile('default', `loaded events of ${module}`);
                        }
                        else if (part === 'entities') {
                            entities.push((0, path_1.join)(module_path, module, srcPart, part, '*.js'));
                            await logger.logToFile('default', `loaded entities of ${module}`);
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
        await logger.logError(`No commands or event handlers have been found!\nThe following directories were checked: ${all_paths.join(',')}`);
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
exports.default = loadModules;
//# sourceMappingURL=loadModules.js.map