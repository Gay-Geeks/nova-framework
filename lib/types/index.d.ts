import { EventEmitter } from 'events';
import { Message, ClientEvents, BaseMessageOptions, Client, StickerResolvable, EmbedBuilder, ApplicationCommandOption, ChatInputCommandInteraction, APIMessage, APIApplicationCommandOptionChoice, Snowflake, GuildMember, GuildManager, UserManager, ChannelManager, BaseGuildEmojiManager } from 'discord.js';
import { schedule } from 'node-cron';
/**
 * The different stages of the hooks system for commands and events
 */
export type HookStage = 'before' | 'handler' | 'after' | 'error';
/**
 * The structure of a hook for use with event handlers
 */
export type EventHook<E extends keyof ClientEvents, DB = undefined> = (ctx: EventContext<E, DB>) => Promise<EventContext<E, DB>>;
/**
 * The structure of a hook for use with commands
 */
export type CommandHook<DB = undefined> = (ctx: CommandContext<DB>) => Promise<CommandContext<DB>>;
/**
 * A mapping struct for generating options for a command argument
 */
export interface OptionChoiceHolder<DB = undefined> {
    [option: string]: (bot: BotContext<DB>) => Promise<APIApplicationCommandOptionChoice[]>;
}
/**
 * The structure with all the options that can be set for an event handler
 */
export interface Event<E extends keyof ClientEvents, DB = undefined> {
    readonly on: E;
    handler: EventHook<E, DB>;
    before?: EventHook<E, DB>[];
    after?: EventHook<E, DB>[];
    error?: EventHook<E, DB>[];
}
/**
 * The BotContext, which holds general information about the bot and tools that are needed everywhere.
 * It contains the discord client, database connection, the list of commands, a scheduler and an event emitter.
 *
 * It also provides some attributes and methods from the discord client as shortcut.
 */
export interface BotContext<DB = undefined> {
    db: DB;
    schedule: typeof schedule;
    events: EventEmitter;
    readonly commands: Command<DB>[];
    readonly client: Client;
    guilds: GuildManager;
    users: UserManager;
    emojis: BaseGuildEmojiManager;
    channels: ChannelManager;
    login: (token?: string) => Promise<string>;
    destroy: () => void;
}
/**
 * The structure with all the options that can be set for a slash command
 */
export interface Command<DB = undefined> {
    name: string;
    description: string;
    permission_level: number;
    command: CommandHook<DB>;
    before?: CommandHook<DB>[];
    after?: CommandHook<DB>[];
    error?: CommandHook<DB>[];
    options?: ApplicationCommandOption[];
    optionChoices?: OptionChoiceHolder<DB>;
    category?: string;
    /**
     * @deprecated has no use with slash command currently
     */
    hidden?: boolean;
}
/**
 * The shared Context interface for command and event handlers, contains methods and attributes that are used by both.
 */
export interface Context<DB = undefined> {
    data?: unknown;
    error?: unknown;
    skip?: boolean;
    stage: HookStage;
    readonly bot: BotContext<DB>;
    /**
     * Returns the config for the bot if provided
     */
    getConfig?: () => unknown;
    /**
     * Returns the permission level of the given member using the function provided to the Client.
     * If no function was provided, it returns 0 always
     */
    getPermissionLevel: (member: GuildMember) => Promise<number>;
}
/**
 * The CommandContext as it gets passed to commands.
 * It contains the interaction that triggered the command, the name of the command and a reply method
 */
export type CommandContext<DB = undefined> = {
    interaction: ChatInputCommandInteraction;
    commandUsed: string;
    reply: (content?: string | EmbedBuilder, options?: ReplyOptions) => Promise<Message | APIMessage | null>;
} & Context<DB> & Logger;
/**
 * The EventContext as it gets passed to event handlers.
 * It contains the client object and the event that triggered the handler
 */
export type EventContext<E extends keyof ClientEvents, DB = undefined> = {
    readonly event: ClientEvents[E];
} & Context<DB> & Logger;
/**
 * The Options that can be passed to the reply method in addition to the usual message options
 */
export type ReplyOptions = {
    autoDelete?: boolean;
    returnReply?: boolean;
    ephemeral?: boolean;
    stickers?: StickerResolvable[];
} & BaseMessageOptions;
/**
 * The configuration options for the Logger
 */
export interface LoggerConfiguration {
    defaultLogChannel?: Snowflake;
    errorLogChannel?: Snowflake;
    logFilePath?: string;
    channelMap?: {
        [key: string]: Snowflake;
    };
    channelFunction?: (logType: string) => string;
}
/**
 * The Logger interface, it handles logging including error logging
 */
export interface Logger {
    readonly configuration: LoggerConfiguration;
    readonly client: Client;
    /**
     * Log the given content or embed to the channel of the given LogType
     */
    log: (type: string, data: string | EmbedBuilder) => Promise<void>;
    /**
     * Log the given error
     */
    logError: (error: unknown) => Promise<void>;
    /**
     * Log the given string, embed title or embed description to a file
     */
    logToFile: (type: string, data: string | EmbedBuilder) => Promise<void>;
}
//# sourceMappingURL=index.d.ts.map