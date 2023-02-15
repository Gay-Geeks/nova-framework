function getPermissionLevel(settings) {
    return (member) => {
        if (typeof settings.getPermissionLevel === 'function') {
            return settings.getPermissionLevel(member);
        }
        return Promise.resolve(0);
    };
}
export default function eventContext(event, bot, logger, settings) {
    return {
        event,
        bot,
        stage: 'before',
        getPermissionLevel: getPermissionLevel(settings),
        getConfig: settings.getConfig,
        ...logger
    };
}
//# sourceMappingURL=eventContext.js.map