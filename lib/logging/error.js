"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
function splitMessage(text, title = '') {
    if (text.length + title.length < 1980) {
        return [`${title} \`\`\`${text}\`\`\``];
    }
    const splittedText = text.split(/([\n\r]+)/);
    const result = [`${title} \`\`\``];
    let i = 0;
    for (const piece of splittedText) {
        if (!result[i])
            result[i] = '```';
        if ((result[i].length + piece.length) > 1990) {
            result[i] += '```';
            i++;
            if (!/([\n\r]+)/.test(piece)) {
                result[i] = `\`\`\`\n${piece}`;
            }
        }
        else {
            result[i] += piece;
        }
    }
    return result;
}
async function clientLogError(logger, error, channel_id) {
    let output = '';
    let logMessage = '';
    if (error instanceof discord_js_1.DiscordAPIError || error instanceof discord_js_1.HTTPError) {
        output = `REST Route: ${error.method} ${error.url}\ndata: ${JSON.stringify(error.requestBody.json)}\n`;
        logMessage = `REST Route: ${error.method} ${error.url}: `;
    }
    if (error instanceof Object && !(error instanceof Error)) {
        Error.captureStackTrace(error);
    }
    const errorLike = error;
    console.error(errorLike);
    await logger.logToFile('error', `${logMessage}${errorLike.name}: ${errorLike.message}`);
    if (!channel_id) {
        return;
    }
    output += errorLike.stack ?? (errorLike.message || error);
    const channel = await logger.client.channels.fetch(channel_id);
    if (channel?.type === discord_js_1.ChannelType.GuildText)
        for (const text of splitMessage(output, '⚠️ error happened:'))
            await channel.send(text);
}
async function logError(error) {
    let channel;
    if (this.configuration.channelFunction) {
        channel = this.configuration.channelFunction('error');
    }
    if (!channel && this.configuration.channelMap) {
        channel = this.configuration.channelMap.error;
    }
    if (!channel) {
        channel = this.configuration.errorLogChannel;
    }
    await clientLogError(this, error, channel);
}
exports.default = logError;
//# sourceMappingURL=error.js.map