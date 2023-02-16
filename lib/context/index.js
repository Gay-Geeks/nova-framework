"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBotContext = exports.eventContext = exports.commandContext = void 0;
var commandContext_1 = require("./commandContext");
Object.defineProperty(exports, "commandContext", { enumerable: true, get: function () { return __importDefault(commandContext_1).default; } });
var eventContext_1 = require("./eventContext");
Object.defineProperty(exports, "eventContext", { enumerable: true, get: function () { return __importDefault(eventContext_1).default; } });
var botContext_1 = require("./botContext");
Object.defineProperty(exports, "createBotContext", { enumerable: true, get: function () { return __importDefault(botContext_1).default; } });
//# sourceMappingURL=index.js.map