import { Client, ClientApplication, User } from "discord.js"

/**
 * Acquires the user ID of the application owner.
 * @param {Client} client The Discord client of the bot.
 * @returns {Promise<string>} The user ID of the application owner.
 */
export default async function (client : Client): Promise<string> {
  // Get application
  const application : ClientApplication | undefined = await client.application?.fetch()
  if (application === undefined) {
    throw new Error('Client application is undefined. Is the client not ready yet?')
  }

  // Get owner
  let owner = application.owner
  if (owner instanceof User) {
    owner = await owner.fetch()
  }
  if (owner === null) {
    throw new Error('Could not fetch owner.')
  }

  return owner.id
}
