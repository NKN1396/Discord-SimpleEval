// External dependencies
import Discord, { SlashCommandBuilder, Routes } from 'discord.js'
import { REST as DISCORD_REST } from '@discordjs/rest'

// Internal dependencies
import { BOT_TOKEN } from '../config.mjs'

/**
 * Check if the eval command has been registered globally. Also checks if the
 * command options are correct.
 * @param {*} client The bot client
 * @returns {boolean} Whether or not the eval command is registered correctly
 */
async function checkEvalCommand (client) {
  const REGISTERED_COMMANDS = await client.application.commands.fetch()

  // Search for eval command
  let evalCommand
  for (const REGISTERED_COMMAND of REGISTERED_COMMANDS.values()) {
    if (REGISTERED_COMMAND.name === 'eval') {
      evalCommand = REGISTERED_COMMAND
      break
    }
  }
  if (evalCommand === undefined) {
    // Eval command not found, return false
    return false
  }

  // Eval command found, check validity
  const EVAL_OPTIONS = evalCommand.options
  const EXPRESSION_OPTION = EVAL_OPTIONS[0]
  const EPHEMERAL_OPTION = EVAL_OPTIONS[1]
  // Check expression option
  if (EXPRESSION_OPTION.name !== 'expression') return false
  if (EXPRESSION_OPTION.type !== 3) return false
  if (EXPRESSION_OPTION.required !== true) return false
  // Check ephemeral option
  if (EPHEMERAL_OPTION.name !== 'ephemeral') return false
  if (EPHEMERAL_OPTION.type !== 5) return false
  if (EPHEMERAL_OPTION.required !== false) return false

  // Command is valid
  return true
}

/**
 * Registers the eval slash command globally.
 * @param {*} client The bot client.
 */
function registerEvalCommand (client) {
  // Build command
  const EXPRESSION_OPTION = new Discord.SlashCommandStringOption()
    .setName('expression')
    .setDescription('The JavaScript expression to evaluate.')
    .setRequired(true)
  const EPHEMERAL_OPTION = new Discord.SlashCommandBooleanOption()
    .setName('ephemeral')
    .setDescription('Whether or not evaluation result will be hidden from other people.')
    .setRequired(false)
  const COMMAND = new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluates a JavaScript expression.')
    .addStringOption(EXPRESSION_OPTION)
    .addBooleanOption(EPHEMERAL_OPTION)
  const COMMANDS = [COMMAND]
    .map(command => command.toJSON())

  // Register built command
  const REST = new DISCORD_REST({ version: '10' }).setToken(BOT_TOKEN)
  REST.put(Routes.applicationCommands(client.application.id), { body: COMMANDS })
    .then(() => console.log('Successfully registered eval command.'))
    .catch(console.error)
}

/**
 * Ensures, that the eval slash command is registered globally.
 * @param {*} client The bot client
 */
export default async function (client) {
  // Check if eval command has already been registered
  const EVAL_COMMAND_EXISTS = await checkEvalCommand(client)
  if (EVAL_COMMAND_EXISTS) return

  // Eval command has not been registered yet
  console.log('Eval command has not been registered yet.')
  registerEvalCommand(client)
}
