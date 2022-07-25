// External dependencies
import Discord from 'discord.js'

// Internal dependencies
import evaluate from './src/handleInteractions.mjs'
import registerCommand from './src/registerCommand.mjs'
import getOwnerId from './src/getOwnerId.mjs'

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

/* eslint-disable no-unused-vars */
const { IntentsBitField } = Discord
/* eslint-enable no-unused-vars */
const client = new Discord.Client({ intents: [] })

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}.`)

  // Register eval slash command globally with the application
  await registerCommand(client)

  // Acquire owner ID for permission checking
  const OWNER_ID = await getOwnerId(client)

  // Listen for interactions
  client.on('interactionCreate', async interaction => {
    evaluate(interaction, OWNER_ID)
  })
})

client.login(BOT_TOKEN)
