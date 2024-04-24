module.exports = {
  data: {
    name: "test",
    description: "Test user command",
    "integration_types": [1],
    "contexts": [0, 1, 2],
  },
  async execute(interaction) {
    await interaction.reply({ content: "Test complete!", ephemeral: true });
  },
};
