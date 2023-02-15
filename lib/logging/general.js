import { ChannelType, EmbedBuilder } from 'discord.js';
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
export async function log(type, data) {
    if (type === 'error')
        return this.logError(data);
    await this.logToFile(type, data);
    const channel_id = getLogChannel(this.configuration, type);
    if (!channel_id) {
        return;
    }
    if (typeof data === 'string')
        data = new EmbedBuilder().setDescription(data);
    const channel = await this.client.channels.fetch(channel_id);
    if (channel?.type === ChannelType.GuildText)
        await channel.send({ embeds: [data] });
}
//# sourceMappingURL=general.js.map