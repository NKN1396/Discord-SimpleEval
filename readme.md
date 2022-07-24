# SimpleEval
A simple implementation of an eval command.
This means you can run arbitrary code directly from Discord chat on the fly without having to restart constantly - an essential tool for debugging your `discord.js` bots!

## Features
* Powerful - You can tell your bot to run ANYTHING. _(Warning: that also includes remote control of whatever system you're running this on!)_
* Lightweight - Only two dependencies, `discord.js` and `@discordjs/rest` are required.
* Ready - Aside from providing your credentials, this bot works as-is, right out of the box.
* Modern - Uses the modern Discord slash-command API. Code is written in EcmaScript-modules.
* Simple - The code is written to be as minimal as possible. If you're new to discord.js bot developement, you might wanna peek inside.

## Setup
### Installation
Install all dependencies with `npm i`.

### Configuration
The bot is exclusively configured through the `config.mjs` file. All you need to do is provide a token.

### Permissions and intents
Don't forget to grant your bot all proper permissions it needs to function correctly.
And don't forget to enable the priviliged gateway intents in your bots' settings. In that case, you might also wanna add intents to `server.mjs`.

### Running the bot
Simply type `npm start` in the console. The program should handle the rest.

## Usage
Type `/eval` followed by whatever code you wish to evaluate.

E.g. ``/eval interaction.guild.fetch()``.
