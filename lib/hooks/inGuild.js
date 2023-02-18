"use strict";
/* eslint-disable @typescript-eslint/require-await */
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageInGuild = exports.inGuild = void 0;
/**
 * Checks if the command was ran inside a guild.
 * If not, it throws an error if provided, or else sets ctx.skip to true
 */
function inGuild(error = null) {
    return async (ctx) => {
        if (!ctx.interaction.guild) {
            if (error) {
                throw error;
            }
            ctx.skip = true;
        }
        return ctx;
    };
}
exports.inGuild = inGuild;
/**
 * Checks if the message was posted inside a guild.
 * If not, it throws an error if provided, or else sets ctx.skip to true
 */
function messageInGuild(error = null) {
    return async (ctx) => {
        const [message] = ctx.event;
        if (!message.guild) {
            if (error) {
                throw error;
            }
            ctx.skip = true;
        }
        return ctx;
    };
}
exports.messageInGuild = messageInGuild;
//# sourceMappingURL=inGuild.js.map