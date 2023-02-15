import logError from './error';
import { log } from './general';
import logToFile from './toFile';
export function createLogger(client, configuration) {
    return {
        client,
        configuration,
        log,
        logError,
        logToFile,
    };
}
//# sourceMappingURL=index.js.map