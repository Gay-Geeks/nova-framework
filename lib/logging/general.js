"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const discord_js_1 = require("discord.js");
function getLogChannel(configuration, type) {
    let channel;
    if (configuration.channelFunction) {
        channel = configuration.channelFunction(type);
    }
    if (!channel && configuration.channelMap) {
        channel = configuration.channelMap[type];
    }
    if (!channel) {
        channel = configuration.defaultLogChannel;
    }
    return channel;
}
async function log(type, data) {
    if (type === 'error')
        return this.logError(data);
    await this.logToFile(type, data);
    const channel_id = getLogChannel(this.configuration, type);
    if (!channel_id) {
        return;
    }
    if (typeof data === 'string')
        data = new discord_js_1.EmbedBuilder().setDescription(data);
    const channel = await this.client.channels.fetch(channel_id);
    if (channel?.type === discord_js_1.ChannelType.GuildText)
        await channel.send({ embeds: [data] });
}
exports.log = log;
//# sourceMappingURL=general.js.map