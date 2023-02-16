"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCommands = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const context_1 = require("../context");
// Loads the choises by either returning undefined if undefined,
// or else calling it with the bot context as the argument
function loadChoices(bot, choicesLoader) {
    if (!choicesLoader) {
        return Promise.resolve(undefined);
    }
    return choicesLoader(bot);
}
/**
 *  Uploads all the commands of the bot to discord as slash-commands
 */
async function uploadCommands(token, client_id, bot) {
    // Get a rest api client
    const rest = new rest_1.REST().setToken(token);
    // Transform all of our command objects to the format discord uses
    const discord_commands = (await Promise.all(bot.commands.map(async (c) => ({
        name: c.name,
        description: c.description,
        default_permission: c.permission_level === 0,
        options: c.options
            ? await Promise.all(c.options.map(async (o) => ({
                ...o,
                type: o.type,
                // Load choices if any have been registered for this command
                choices: await loadChoices(bot, c.optionChoices ? c.optionChoices[o.name] : undefined),
            })))
            : undefined,
    }))));
    // Upload the commands to discord and get the returned objects as ApplicationCommands
    await rest.put(v9_1.Routes.applicationCommands(client_id), {
        body: discord_commands,
    });
}
exports.uploadCommands = uploadCommands;
// Run a command based on the given interaction and given the bot context
async function runCommand(command, interaction, bot, logger, settings) {
    // Create the command context
    const ctx = (0, context_1.commandContext)(interaction, command.name, bot, logger, settings);
    // Handle an encountered error
    const handleError = async (e) => {
        // Default to the standard error handlers if no error hooks have been registered
        if (typeof command.error === 'undefined' || command.error.length < 1) {
            // Just log if error is anything else
            await ctx.logError(e);
        }
        else {
            try {
                // Let the error hooks handle the error
                await command.error.reduce((chain, hook) => chain.then(hook), Promise.resolve({
                    ...ctx,
                    error: e,
                    stage: 'error',
                }));
            }
            catch (err) {
                // If the error hooks threw another error, log the error
                await ctx.logError(err);
            }
        }
    };
    // Call the commands
    await (command.before
        ? // Call the before hooks of the command if they exist
            command.before.reduce((chain, hook) => chain.then(hook), Promise.resolve(ctx))
        : Promise.resolve(ctx))
        .then((ctx) => ctx.skip
        ? Promise.resolve(ctx)
        : // Call the command itself is it hasn't been skipped
            command.command({
                ...ctx,
                stage: 'handler',
            }))
        .then((ctx) => !ctx.skip && command.after
        ? // If there are after hooks and they haven't been skipped, call the after hooks
            command.after.reduce((chain, hook) => chain.then(hook), Promise.resolve({
                ...ctx,
                stage: 'after',
            }))
        : ctx)
        // If any error was thrown, handle the error
        .catch(handleError);
}
/**
 * The command handler, it returns a function that should be called with an incoming command interaction to handle it.
 */
function commandHandler(commands, bot, logger, settings) {
    // Makes the list of commands into a map, to be able to index it by the command name
    const commandMap = commands.reduce((all, command) => {
        all[command.name] = command;
        return all;
    }, {});
    // The command interaction handler
    return async (interaction) => {
        const commandUsed = commandMap[interaction.commandName];
        if (typeof commandUsed === 'undefined') {
            return;
        }
        await runCommand(commandUsed, interaction, bot, logger, settings);
    };
}
exports.default = commandHandler;
//# sourceMappingURL=commandHandler.js.map