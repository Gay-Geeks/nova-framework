import { Client } from 'discord.js';
import logError from './error';
import { log } from './general';
import logToFile from './toFile';
import { Logger, LoggerConfiguration } from '../types';

export function createLogger(client: Client, configuration: LoggerConfiguration): Logger {
	return {
		client,
		configuration,
		log,
		logError,
		logToFile,
	}
}
