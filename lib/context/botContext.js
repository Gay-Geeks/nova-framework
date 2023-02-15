import { EventEmitter } from 'events';
import { schedule } from 'node-cron';
/**
 * Create a BotContext object;
 * holds the database connection, list of commands, an events emitter and scheduler
 */
export default function createBotContext(settings, commands) {
    return {
        db: settings.database,
        commands,
        schedule,
        events: new EventEmitter()
    };
}
//# sourceMappingURL=botContext.js.map