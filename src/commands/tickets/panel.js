const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket panel creation")
    .addSubcommand((cmd) =>
      cmd
        .setName("panel_create")
        .setDescription("Create a ticket panel in a certain channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Select channel to send panel to")
            .setRequired(true)
            .addChannelTypes(0)
        )
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("support_menu")
        .setPlaceholder("Select a category")
        .addOptions([
          {
            label: "General Support",
            value: "support",
          },
          {
            label: "Billing and Purchase Information",
            value: "billing",
          },
          {
            label: "Report",
            value: "report",
          },
          {
            label: "Administrative support",
            value: "admin",
          },
          {
            label: "Reset menu",
            description: "Press this so you can open any ticket type again.",
            value: "reset",
          },
        ])
    );

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Support Tickets")
      .setDescription("Select a category below to open a ticket");

    await channel.send({
      embeds: [embed],
      components: [row],
    });

    return interaction.reply({
      content: `Ticket panel created in: ${channel.name} !`,
      ephemeral: true,
    });
  },
};
