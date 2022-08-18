// External dependencies
import Discord, { SlashCommandBuilder, Routes, ApplicationCommandOptionType } from 'discord.js';
import { REST as DISCORD_REST } from '@discordjs/rest';
// Internal dependencies
import { BOT_TOKEN } from '../config.js';
/**
 * Check if the eval command has been registered globally. Also checks if the
 * command options are correct.
 * @param {Client} client The bot client
 * @returns {Promise<boolean>} Whether or not the eval command is registered correctly
 */
async function checkEvalCommand(client) {
    // Get commands
    const application = await client.application?.fetch();
    if (application === undefined) {
        throw new Error('Client application is null. Is the client not ready yet?');
    }
    const registeredCommands = await application.commands.fetch();
    // Search for eval command
    let evalCommand;
    for (const registeredCommand of registeredCommands.values()) {
        if (registeredCommand.name === 'eval') {
            evalCommand = registeredCommand;
            break;
        }
    }
    if (evalCommand === undefined) {
        // Eval command not found, return false
        return false;
    }
    // Eval command found, check validity
    let evalOptions;
    let expressionOption;
    let ephemeralOption;
    try {
        evalOptions = evalCommand.options;
        expressionOption = evalOptions[0];
        ephemeralOption = evalOptions[1];
    }
    catch (error) {
        return false;
    }
    // Check expression option
    if (expressionOption.name !== 'expression')
        return false;
    if (expressionOption.type !== ApplicationCommandOptionType.String) {
        return false;
    }
    if (expressionOption.required !== true)
        return false;
    // Check ephemeral option
    if (ephemeralOption.name !== 'ephemeral')
        return false;
    if (ephemeralOption.type !== ApplicationCommandOptionType.Boolean) {
        return false;
    }
    if (ephemeralOption.required !== false)
        return false;
    // Command is valid
    return true;
}
/**
 * Registers the eval slash command globally.
 * @param {*} client The bot client.
 */
async function registerEvalCommand(client) {
    // Build command
    const EXPRESSION_OPTION = new Discord.SlashCommandStringOption()
        .setName('expression')
        .setDescription('The JavaScript expression to evaluate.')
        .setRequired(true);
    const EPHEMERAL_OPTION = new Discord.SlashCommandBooleanOption()
        .setName('ephemeral')
        .setDescription('Whether or not evaluation result will be hidden from other people.')
        .setRequired(false);
    const COMMAND = new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates a JavaScript expression.')
        .addStringOption(EXPRESSION_OPTION)
        .addBooleanOption(EPHEMERAL_OPTION);
    const COMMANDS = [COMMAND].map((command) => command.toJSON());
    // Register built command
    const REST = new DISCORD_REST({ version: '10' }).setToken(BOT_TOKEN);
    const application = await client.application?.fetch();
    if (application === undefined) {
        throw new Error('Client application is null. Is the client not ready yet?');
    }
    REST.put(Routes.applicationCommands(application.id), {
        body: COMMANDS
    })
        .then(() => console.log('Successfully registered eval command.'))
        .catch(console.error);
}
/**
 * Ensures, that the eval slash command is registered globally.
 * @param {*} client The bot client
 */
export default async function (client) {
    // Check if eval command has already been registered
    const EVAL_COMMAND_EXISTS = await checkEvalCommand(client);
    if (EVAL_COMMAND_EXISTS)
        return;
    // Eval command has not been registered yet
    console.log('Eval command has not been registered yet.');
    void registerEvalCommand(client);
}
//# sourceMappingURL=registerCommand.js.map