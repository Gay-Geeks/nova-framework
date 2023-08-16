"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
async function logToFile(type, data, ...args) {
    const now = new Date();
    let message = `${now.toUTCString().slice(0, -4)}.${now.getUTCMilliseconds()}: ${type.toUpperCase()}: `;
    if (typeof data === 'string') {
        message += data;
    }
    else if (data.data.title?.length) {
        message += data.data.title;
    }
    else {
        message += data.data.description;
    }
    if (args.length > 0) {
        message += ` ${args.join(' ')}`;
    }
    if (type === 'error') {
        console.error(message);
    }
    else {
        console.log(message);
    }
    if (!this.configuration.logFilePath)
        return;
    await (0, promises_1.appendFile)(this.configuration.logFilePath, `${message}\n`);
}
exports.default = logToFile;
//# sourceMappingURL=toFile.js.map