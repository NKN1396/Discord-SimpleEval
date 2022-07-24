/**
 * Acquires the user ID of the application owner.
 * @param {*} client The Discord client of the bot.
 * @returns {string} The user ID of the application owner.
 */
export default async function (client) {
  const APPLICATION = await client.application.fetch()
  const OWNER = await APPLICATION.owner.fetch()
  return OWNER.id
}
