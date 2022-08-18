// External dependencies
import { inspect } from 'util';
import { EmbedBuilder } from 'discord.js';
/**
 * Handles all interactions from the client and executes an expression if called
 * with the evaluation command.
 * @param {Interaction} interaction An interaction received by the client
 * @param {string} ownerId The owners' user ID.
 * @returns {Promise<void>}
 */
export default async function (interaction, ownerId) {
    // Check if we received a slash command
    if (!interaction.isChatInputCommand())
        return;
    // Check if we received the eval command
    if (interaction.commandName !== 'eval')
        return;
    // Defer, so we can take up to 15 minutes to evaluate
    const IS_EPHEMERAL = interaction.options.getBoolean('ephemeral') ?? true;
    await interaction.deferReply({ ephemeral: IS_EPHEMERAL });
    // Check if command was sent by owner
    if (interaction?.user.id !== ownerId) {
        // Command was not sent by owner, send rejection
        void interaction.editReply("You're not allowed to use this command!");
        return;
    }
    // Execute expression
    let result;
    const expression = interaction.options.getString('expression');
    if (expression === null) {
        throw new Error('Expression received is null.');
    }
    let startTime = 0n;
    let endTime = 0n;
    try {
        startTime = process.hrtime.bigint();
        /* eslint-disable no-eval */
        result = await eval(`(async ()=>{return ${expression}})()`);
        /* eslint-enable no-eval */
        endTime = process.hrtime.bigint();
        result = inspect(result, { depth: 0 });
    }
    catch (error) {
        displayError(interaction, error);
        return;
    }
    // Output result
    displayResult(result, interaction, startTime, endTime, expression);
}
/**
 * Displays the error that occured during the evaluation of an expression.
 * @param {CommandInteraction} interaction The interaction that instantiated the evaluation.
 * @param {unknown} error The error that occured.
 */
function displayError(interaction, error) {
    if (error instanceof Error) {
        // Error instance received
        void interaction.editReply(`\`${error.name}: ${error.message}\``);
        return;
    }
    // Some other (unknown) error was received
    void interaction.editReply(`\`${error}\``);
}
/**
 * Displays the result of the evaluated expression as a formatted message.
 * @param {string} result The result of the evaluated expression.
 * @param {CommandInteraction} interaction The interaction that instantiated the evaluation.
 * @param {bigint} startTime The process time (in nanoseconds) when the evaluation finished.
 * @param {bigint} endTime The process time (in nanoseconds) when the evaluation started.
 * @param {string} expression The string containing the expression to evaluate.
 */
function displayResult(result, interaction, startTime, endTime, expression) {
    // Evaluation successful. Generate formatted response.
    const EVALUATION_TIME = Number(endTime - startTime) / 1000000;
    const REPLY = new EmbedBuilder()
        .addFields({
        name: 'Original expression',
        value: `\`\`\`javascript\n${expression}\n\`\`\``
    }, { name: 'Run time', value: `${EVALUATION_TIME} ms` })
        .setTitle('Result')
        .setDescription(`\`\`\`javascript\n${result}\n\`\`\``);
    void interaction.editReply({ embeds: [REPLY] });
}
//# sourceMappingURL=handleInteractions.js.map