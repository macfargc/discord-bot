const { SlashCommandBuilder } = require("discord.js");

const config = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tos")
    .setDescription("Show the terms of service"),
  async execute(interaction) {
    if (!config.tos)
      return interaction.reply({
        content: "There is no tos set for this server.",
        ehpemeral: true,
      });
    interaction.reply(tos);
  },
};
