"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function eventContext(event, bot, logger, settings) {
    return {
        event,
        bot,
        stage: 'before',
        getConfig: settings.getConfig,
        ...logger,
        getPermissionLevel: function (member) {
            return settings.getPermissionLevel(this, member);
        },
    };
}
exports.default = eventContext;
//# sourceMappingURL=eventContext.js.map