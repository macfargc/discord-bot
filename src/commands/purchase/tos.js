const { SlashCommandBuilder } = require("discord.js");

require("dotenv").config();

const tos = process.env.tos;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tos")
    .setDescription("Show the terms of service"),
  async execute(interaction) {
    interaction.reply(tos);
  },
};
