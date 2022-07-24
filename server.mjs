// External dependencies
import Discord, { GatewayIntentBits } from 'discord.js'

// Internal dependencies
import evaluate from './src/evaluate.mjs'
import registerCommand from './src/registerCommand.mjs'

// Configuration
import { BOT_TOKEN } from './config.mjs'

/**
 * Utility dependencies for use inside of eval commands.
 * Feel free to add whatever you need here to enhance your experience.
 */
/* eslint-disable no-unused-vars */
// import _ from 'lodash'
// import ct from "common-tags"
// import luxon from "luxon"
/* eslint-enable no-unused-vars */

const bot = new Discord.Client({
  intents: []
})

bot
  .on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}.`)
    registerCommand(bot)
  })
  .on('interactionCreate', async interaction => {
    evaluate(interaction)
  })

bot.login(BOT_TOKEN)
