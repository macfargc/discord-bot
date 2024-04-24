require("dotenv").config();
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const { guild, user } = member;

    const memberCount = guild.memberCount;

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(`${user} joined and is member #${memberCount}`)
      .setFooter({ text: Date.now(), iconURL: user.displayAvatarURL() });

    const welcomeChannel = guild.channels.cache.get(
      process.env.welcomeChannelId
    );

    await welcomeChannel.send({ embeds: [embed] });
  },
};
