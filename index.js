// Dependencies
import Discord from "discord.js"
import util from "util"

// Config
import token from "./token.js"
import ownerID from "./owner.js"

// Utility dependencies for eval command
// Feel free to add whatever you need here.
/* eslint-disable no-unused-vars */
import _ from "lodash"
// import ct from "common-tags"
// import luxon from "luxon"
/* eslint-enable no-unused-vars */

const bot = new Discord.Client()

bot.on("message", async message => {
  // Make sure message was sent by owner
  if (message.author.id !== ownerID) { return }

  // Check if "!eval" was used and extract payload
  const trigger = /^!eval\s+([\S\s]+)/is
  const payload = trigger.exec(message.content)?.[1]
  if (payload === undefined) { return }

  // Execute payload
  let result
  const start = process.hrtime.bigint()
  try {
    /* eslint-disable no-eval */
    result = util.inspect(eval(payload), { depth: 0 })
    /* eslint-enable no-eval */
  } catch (error) {
    result = error
  }
  const end = process.hrtime.bigint()

  // Output result
  if (_.isError(result)) {
    // Result errored
    message.channel.send(`\`${result.name}: ${result.message}\``)
  } else {
    message.channel.send(`${message.author} evaluated in ${Number(end - start) / 1000000}ms:\n\`\`\`javascript\n${result}\n\`\`\``, { split: { prepend: "```javascript\n", append: "\n```" } })
  }
})

bot.on("ready", () => {
  console.log("Bot ready!")
})

bot.login(token)
