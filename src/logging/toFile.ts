import { appendFile } from 'fs/promises';
import { EmbedBuilder } from 'discord.js';
import { Logger } from '..'

export default async function logToFile(this: Logger, type: string, data: string | EmbedBuilder, ...args: any[]) {
	if (!this.configuration.logFilePath)
		return;

	const now = new Date();
	let message = `${now.toUTCString().slice(0, -4)}.${now.getUTCMilliseconds()}: ${type.toUpperCase()}: `;

	if (typeof data === 'string') {
		message += data;
	} else if (data.data.title?.length) {
		message += data.data.title;
	} else {
		message += data.data.description;
	}

	if (args.length > 0) {
		message += ` ${args.join(' ')}`;
	}

	if (type === 'error') {
		console.error(message);
	} else {
		console.log(message);
	}

	await appendFile(this.configuration.logFilePath, `${message}\n`);
}
