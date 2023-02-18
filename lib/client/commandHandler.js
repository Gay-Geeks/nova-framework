"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCommands = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const context_1 = require("../context");
/**
 * If ctx.skip, then skip, else run the hook
 */
function hookOrSkip(ctx, hook) {
    if (ctx.skip)
        return ctx;
    return hook(ctx);
}
/**
 * A hook to set the stage of the context
 */
function setStage(stage) {
    return (ctx) => Promise.resolve({
        ...ctx,
        stage
    });
}
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
    await (command.before ?? []).reduce((chain, hook) => chain.then(ctx => hookOrSkip(ctx, hook)), Promise.resolve(ctx))
        .then(setStage('handler'))
        .then(ctx => hookOrSkip(ctx, command.command))
        .then(setStage('after'))
        .then(ctx => (command.after ?? []).reduce((chain, hook) => chain.then(ctx => hookOrSkip(ctx, hook)), Promise.resolve(ctx))).catch(handleError);
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