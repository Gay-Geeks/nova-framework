# Nova Framework

This is the command and event framework used in the custom bots of the [Gay Geeks discord server], mainly Nova.

## Features

This framework is made to be easy to use, while being heavily customisable.
It is built around [discord.js], the biggest JS/TS library for interacting with the discord API.

### Functional

This framework is mostly based on functional programming paradigms.
This provides easy modularity and extensibility, with functions being able to be combined and chained to create the command and event handlers that are the core of any discord bot.

### Hooks

Hooks are the core of how nova-framework functions.
They are used to enable easy reuse of pre-processing and filtering functions,
before the actual action of the command handler itself is taken.

These hooks are structured in the same way as the command handler itself (actually, the command handler is 'secretly' just another hook).
They take a command or event context object, act upon it and return it again.
There are three different hook stages: before, after and error.
Before and after are around the command handler and the error stage is when an error has been thrown and are used to handle this error.

The context object has a stage attribute to designate the stage the hook is being ran in, and if in the error stage, an error attribute with the error that was thrown.
The skip attribute can be set to true, to skip any further hook (including the command handler), except potentially error handlers.

In the `hooks` module a few commonly used hooks for command or event handlers have been provided.

### Logging

This framework also provides methods to make logging to stdout, files and/or discord channels easier.
Of course, these are, as always, made to be customizable to suit any need.

## How to use

### Directory structure

The framework loads commands and events based on modules at runtime.
These are loaded based on the given module paths and are expected to be of the following structure:

```plain
modules_dir
└── src
    ├── commands (command handlers)
    │   ├── *.js
    ├── events (event handlers)
    │   ├── *.js
    └── entities (database entities)
        ├── *.js
```

There can be a folder between the modules dir and the src and there can be multiple modules in one provided modules dir.

Below are examples of the command and events handlers, the database entities depend on your bot's implementation.
These entities are on startup provided to a given `loadDatabaseEntities` or `setupDatabase` function.

### Command Example

```ts
import { Command, CommandContext, hooks } from 'nova-framework';

// The command handler
async function ping(ctx: CommandContext) {
  ctx.reply('pong!');

  return ctx;
}

// The command object
const cmd: Command = {
  name: 'ping',
  description: 'Ping the bot!',
  command: ping,
  // These hooks ensure that the command is getting executed when it is ran in a guild
  // And also if someone tries to run it again within 5 seconds
  before: [hooks.inGuild(), hooks.cooldown(5)],
};

export default cmd;
```

### Event example

```ts
import { Event, EventContext, hooks } from 'nova-framework';

// The event handler
async function handler(ctx: EventContext<'messageCreate'>) {
  const [message] = ctx.event;

  // Do something with the message

  return ctx;
}

// The event object
const event: Event<'messageCreate'> = {
  handler,
  on: 'messageCreate',
  // This hook ensures that the handler will not be called on any message by a bot
  before: [hooks.ignoreBotMessages()],
};

export default event;
```

### Create client and start bot example

```ts
import { ClientBuilder } from 'nova-framework';

const [bot, logger] = await new ClientBuilder(token)
  .setLoggerOptions({
    logFilePath: './bot-logs.txt',
  })
  .addModulePaths(
    join(__dirname, '..')
  )
  .build();

await bot.login().catch((e) => logger.logError(e))
```

## Contact

In case of issues, bugs or questions, feel free to create an issue here, or join the [Gay Geeks discord server] and ping/dm `Calli#3141`.

[Gay Geeks discord server]: discord.gg/gaygeeks
[discord.js]: https://discord.js.org/
