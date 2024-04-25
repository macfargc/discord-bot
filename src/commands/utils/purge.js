const { PermissionsBitField } = require("discord.js");
const config = require("../../../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge a certain number of messages")
    .addNumberOption((option) =>
      option
        .setName("num_of_msgs")
        .setDescription("Enter the number of messages you want to delete")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user has the 'MANAGE_MESSAGES' permission
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return interaction.reply({
        content: "You do not have permission to manage messages!",
        ephemeral: true,
      });
    }

    // Retrieve the number of messages to delete from the interaction options
    const numOfMsgs = interaction.options.getNumber("num_of_msgs");

    // Check if the numOfMsgs is a valid number
    if (isNaN(numOfMsgs) || numOfMsgs <= 0) {
      return interaction.reply({
        content: "Please enter a valid number of messages to delete.",
        ephemeral: true,
      });
    }

    // Delete the specified number of messages
    await interaction.channel.bulkDelete(numOfMsgs);

    // Reply to the interaction indicating successful deletion
    await interaction.reply({
      content: `Deleted ${numOfMsgs} messages.`,
      ephemeral: true,
    });

    // Build the log embed
    const logEmbed = new EmbedBuilder()
      .setTitle(
        `Purge command was used in ${interaction.channel.name} (${interaction.channel.id})`
      )
      .setColor((137, 207, 240))
      .setDescription(
        `This command was ran by <@${interaction.user.id}> and they deleted ${numOfMsgs} messages.`
      ); // You can replace "#89CFF0" with a valid color code

    // Send the log embed to the log channel
    const logChannel = interaction.guild.channels.cache.get(
      config.logChannelId
    );
    if (logChannel) {
      await logChannel.send({ embeds: [logEmbed] });
    }
  },
};
