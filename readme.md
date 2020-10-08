# SimpleEval
A very simple implementation of an eval command.
This means you can run code from Discord chat on the fly without having to restart constantly - a great tool for debugging!
This command also comes shipped as a default command with `discord.js-commando`, although this is my own implementation. 
## Features
* Simple - the entire bot only has like 50 lines of code.
* Powerful - you can tell your bot to run ANYTHING. _(Warning: that also includes remote control of whatever system you're running this on!)_
* Two dependencies - only `discord.js` and `lodash` are required.
## Setup
The bot is exclusively configured through .js files.
To run it simply install all dependencies (`npm i`) before using `npm start`.
Make sure to set `NODE_ENV=production` or otherwise your node_modules folder will quadruple in size!
### Token
Provide your token to the token.js file.
### Owner
You have to add your own user ID to the owner.js file in order for the command to work. Be aware that whoever is able to evaluate code, can do damage to your computer.
## Usage
Type `!eval` followed by whatever code you wish to execute. E.g. ``!eval message.channel.send(message.guild.emojis.cache.reduce((acc,cur)=>{return`${acc}\n<${cur.url}>`},""),{split:true})``.
