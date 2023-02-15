export default function eventContext(event, bot, logger, settings) {
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
//# sourceMappingURL=eventContext.js.map