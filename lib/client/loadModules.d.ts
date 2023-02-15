import { ClientEvents } from 'discord.js';
import { ClientSettings } from './clientSettings';
import { Command, Event, Logger } from '..';
/**
 * Loads all modules into the bot. This goes through the module path and treats every directory in it as a module.
 * In a module, all js files in the commands directory are loaded as commands,
 * all in the events directory as event handlers and all in the entities directory as database entities.
 */
export default function loadModules<DB>(logger: Logger, settings: ClientSettings<DB>): Promise<{
    commands: Command<DB>[];
    events: Event<keyof ClientEvents, DB>[];
    entities: string[];
}>;
//# sourceMappingURL=loadModules.d.ts.map