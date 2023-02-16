"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Reply to the interaction that triggered the command
 */
async function reply(content, options) {
    const isEmbed = typeof content === 'object';
    const opts = {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        embeds: isEmbed ? [content] : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        content: isEmbed || !content ? undefined : content,
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
/**
 * Create a CommandContext object;
 * holds information about the command and some useful methods
 */
function commandContext(interaction, command, bot, logger, settings) {
    return {
        interaction,
        commandUsed: command,
        bot,
        stage: 'before',
        getConfig: settings.getConfig,
        reply,
        ...logger,
        getPermissionLevel: function (member) {
            return settings.getPermissionLevel(this, member);
        },
    };
}
exports.default = commandContext;
//# sourceMappingURL=commandContext.js.map