"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const node_cron_1 = require("node-cron");
/**
 * Create a BotContext object;
 * holds the database connection, list of commands, an events emitter and scheduler
 */
function createBotContext(settings, client, commands) {
    return {
        client,
        commands,
        schedule: node_cron_1.schedule,
        db: settings.database,
        events: new events_1.EventEmitter(),
        guilds: client.guilds,
        users: client.users,
        channels: client.channels,
        emojis: client.emojis,
        login: function (token) {
            return this.client.login(token ?? settings.token);
        },
        destroy: function () {
            return this.client.destroy();
        }
    };
}
exports.default = createBotContext;
//# sourceMappingURL=botContext.js.map