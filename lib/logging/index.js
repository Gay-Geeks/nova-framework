"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const tslib_1 = require("tslib");
const error_1 = tslib_1.__importDefault(require("./error"));
const general_1 = require("./general");
const toFile_1 = tslib_1.__importDefault(require("./toFile"));
function createLogger(client, configuration) {
    return {
        client,
        configuration,
        log: general_1.log,
        logError: error_1.default,
        logToFile: toFile_1.default,
    };
}
exports.createLogger = createLogger;
//# sourceMappingURL=index.js.map