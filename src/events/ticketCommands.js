const discordTranscripts = require("discord-html-transcripts");
const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (!message.content.startsWith("++")) return;

    if (message.content.startsWith("++close")) {
      const ticketTranscriptLogChannel = message.guild.channels.cache.get(
        config.ticketLogChannelId
      );
      const channelName = message.channel.name;
      const split = channelName.split("-");
      if (split.length < 2) return;
      const ticketType = split[0];
      const tag = split[1];
      const guild = message.guild;

      const attachment = await discordTranscripts.createTranscript(
        message.channel,
        {
          limit: -1,
          returnType: "attachment",
          filename: "transcript.html",
          saveImages: true,
          footerText: `${message.guild.name} ${ticketType} ticket transcript`,

          ssr: true,
        }
      );
      const logEmbed = new EmbedBuilder()
        .setTitle(`A ${ticketType} ticket was closed.`)
        .setColor("Green")
        .setFooter({
          text: "Ticket Closed",
          iconURL: message.author.displayAvatarURL(),
        });
      guild.members.cache.forEach((member) => {
        if (member.user.tag === tag) {
          member.user.send({
            content: `Your ${ticketType} ticket was closed in ${message.guild.name}, to view the transcript just download the file below (html) and run it (It should be auto set to your default browser to just double click it!)`,
            files: [attachment],
          });

          logEmbed.setDescription(
            `This ticket was opened by: <@${member.user.id}> and closed by <@${message.author.id}>`
          );
        }
      });
      await ticketTranscriptLogChannel.send({
        embeds: [logEmbed],
        files: [attachment],
      });
      message.channel.delete();
    }
  },
};
