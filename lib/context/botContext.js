"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const node_cron_1 = require("node-cron");
/**
 * Create a BotContext object;
 * holds the database connection, list of commands, an events emitter and scheduler
 */
function createBotContext(settings, commands) {
    return {
        db: settings.database,
        commands,
        schedule: node_cron_1.schedule,
        events: new events_1.EventEmitter()
    };
}
exports.default = createBotContext;
//# sourceMappingURL=botContext.js.map