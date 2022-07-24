// External dependencies
import { inspect } from 'util'

let ownerId

async function setOwnerId (interaction) {
  if (ownerId !== undefined) return

  // Owner ID is not yet known, acquire
  const APPLICATION = await interaction.client.application.fetch()
  const OWNER = await APPLICATION.owner.fetch()
  ownerId = OWNER.id

  console.log(`Acquired owner ID: ${ownerId}`)
}

/**
 * Handles all interactions from the client and executes an expression if called
 * with the evaluation command.
 * @param {*} interaction An interaction received by the client.
 */
export default async function (interaction) {
  // Check if we received a slash command
  if (!interaction.isChatInputCommand()) return

  // Check if we received the eval command
  if (interaction.commandName !== 'eval') return

  // Defer, so we can take up to 15 minutes to evaluate
  const IS_EPHEMERAL = interaction.options.getBoolean('ephemeral') ?? true
  await interaction.deferReply({ ephemeral: IS_EPHEMERAL })

  // Check if command was sent by owner
  await setOwnerId(interaction)
  if (interaction?.user.id !== ownerId) {
    // Command was not sent by owner, send rejection
    interaction.editReply("You're not allowed to use this command!")
    return
  }

  // Execute expression
  let result
  const START_TIME = process.hrtime.bigint()
  try {
    const EXPRESSION = interaction.options.getString('expression')
    /* eslint-disable no-eval */
    result = await eval(EXPRESSION)
    /* eslint-enable no-eval */
    result = inspect(result, { depth: 0 })
  } catch (error) {
    result = error
  }
  const END_TIME = process.hrtime.bigint()

  // Output result
  displayResult(result, interaction, END_TIME, START_TIME)
}

/**
 * Displays the result of the evaluated expression as a formatted message.
 * @param {*} result The result of the evaluated expression. Can bei either a string or an Error object.
 * @param {*} interaction The interaction that instantiated the evaluation.
 * @param {*} END_TIME The process time (in nanoseconds) when the evaluation finished.
 * @param {*} START_TIME The process time (in nanoseconds) when the evaluation started.
 */
function displayResult (result, interaction, END_TIME, START_TIME) {
  if (result instanceof Error) {
    // Result errored
    interaction.editReply(`\`${result.name}: ${result.message}\``)
    return
  }

  // Evaluation successful. Do proper formatting.
  const EVALUATION_TIME = Number(END_TIME - START_TIME) / 1000000
  interaction.editReply(
    `${interaction.user} evaluated in ${EVALUATION_TIME}ms:\n\`\`\`javascript\n${result}\n\`\`\``,
    { split: { prepend: '```javascript\n', append: '\n```' } }
  )
}
