import { ChannelType, EmbedBuilder } from 'discord.js';
import { Logger, LoggerConfiguration } from '../types';

function getLogChannel(configuration: LoggerConfiguration, type: string): string | undefined {
	let channel: string | undefined;
	if (configuration.channelFunction) {
		channel = configuration.channelFunction(type);
	}
	if (!channel && configuration.channelMap) {
		channel = configuration.channelMap[type]
	}
	if (!channel) {
		channel = configuration.defaultLogChannel
	}

	return channel;
}

export async function log(this: Logger, type: string, data: string | EmbedBuilder) {
	if (type === 'error') return this.logError(data);

	await this.logToFile(type, data);

	const channel_id = getLogChannel(this.configuration, type);
	if (!channel_id) {
		return
	}

	if (typeof data === 'string') data = new EmbedBuilder().setDescription(data);

	const channel = await this.client.channels.fetch(channel_id);
	if (channel?.type === ChannelType.GuildText) await channel.send({ embeds: [data] });
}
