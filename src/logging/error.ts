import { ChannelType, DiscordAPIError, EmbedBuilder, HTTPError } from 'discord.js';
import { Logger } from '../types';

function splitMessage(text: string, title = ''): string[] {
	if (text.length + title.length < 1980) {
		return [`${title} \`\`\`${text}\`\`\``]
	}

	const splittedText = text.split(/([\n\r]+)/);
	const result = [`${title  } \`\`\``];
	let i = 0;
	for (const piece of splittedText) {
		if (!result[i]) result[i] = '```';

		if ((result[i].length + piece.length) > 1990) {
			result[i] += '```'
			i++;
			if (!/([\n\r]+)/.test(piece)) {
				result[i] = `\`\`\`\n${piece}`
			}
		} else {
			result[i] += piece
		}
	}

	return result
}

async function clientLogError(logger: Logger, error: unknown, channel_id?: string) {
	let output = '';
	let logMessage = '';
	if (error instanceof DiscordAPIError || error instanceof HTTPError) {
		output = `REST Route: ${error.method} ${error.url}\ndata: ${JSON.stringify(error.requestBody.json)}\n`;
		logMessage = `REST Route: ${error.method} ${error.url}: `;
	} else if (error instanceof EmbedBuilder) {
		error = error.data.description ?? error.data.title
	}

	if (error instanceof Object && !(error instanceof Error)) {
		Error.captureStackTrace(error);
	}

	let errorLike: Error;
	if (typeof error === 'undefined') {
		errorLike = new Error('Got an undefined error to log')
	} else if (typeof error === 'string') {
		errorLike = new Error(error)
	} else {
		errorLike = error as Error;
	}

	await logger.logToFile('error', `${logMessage}${errorLike.name}: ${errorLike.message}`);
	errorLike.stack && console.error(errorLike.stack)

	if (!channel_id || !logger.client.isReady()) {
		return
	}

	output += errorLike.stack ?? ((errorLike.message || error) as string);

	const channel = await logger.client.channels.fetch(channel_id);

	if (channel?.type === ChannelType.GuildText)
		for (const text of splitMessage(output, '⚠️ error happened:')) await channel.send(text);
}

export default async function logError(this: Logger, error: unknown) {
	let channel: string | undefined;
	if (this.configuration.channelFunction) {
		channel = this.configuration.channelFunction('error');
	}
	if (!channel && this.configuration.channelMap) {
		channel = this.configuration.channelMap.error
	}
	if (!channel) {
		channel = this.configuration.errorLogChannel
	}
	if (!channel) {
		channel = this.configuration.defaultLogChannel
	}

	await clientLogError(this, error, channel);
}
