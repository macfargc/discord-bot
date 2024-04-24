const { EmbedBuilder, ChannelType } = require("discord.js");
require("dotenv").config();
const config = require("../../config.json");


module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const userName = interaction.user.tag;

    const choice = interaction.values[0];

    if (choice === "support") {
      try {
        const supportChannel = await interaction.guild.channels.create({
          name: `support-${userName}`,
          type: ChannelType.GuildText,
          parent: process.env.ticketCategoryId,
        });
        await interaction.reply({
          content: `New support ticket opened @ <#${supportChannel.id}>`,
          ephemeral: true,
        });
        const embed = new EmbedBuilder()
          .setTitle("Support Questionare responses")
          .setDescription(
            "Below are all of the questions asked and all of the responses."
          )
          .setColor("Blue")
          .setFooter({
            text: `${userName}'s support ticket`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        const supportQuestions = config.supportTicketQuestions;

        for (const question of supportQuestions) {
          await supportChannel.send(question);
          const response = await supportChannel.awaitMessages({
            filter: (m) => m.author.id === interaction.user.id,
            max: 1,
          });

          embed.addFields({
            name: `${question}`,
            value: `${response.first().content}`,
          });
        }
        const channelMessages = await supportChannel.messages.fetch();

        channelMessages.forEach(async (message) => {
          await message.delete();
        });
        await supportChannel.send({ embeds: [embed] });
      } catch (e) {
        console.error(e);
      }
    } else if (choice === "billing") {
      try {
        const billingChannel = await interaction.guild.channels.create({
          name: `billing-${userName}`,
          type: ChannelType.GuildText,
          parent: process.env.ticketCategoryId,
        });
        await interaction.reply({
          content: `New billing & purchase ticket opened @ <#${billingChannel.id}>`,
          ephemeral: true,
        });
        const embed = new EmbedBuilder()
          .setTitle("Billing & Purchase Questionare responses")
          .setDescription(
            "Below are all of the questions asked and all of the responses."
          )
          .setColor("Blue")
          .setFooter({
            text: `${userName}'s Billing & support ticket`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        const purchaseQuestions = config.purchaseTicketQuestions;
        for (const question of purchaseQuestions) {
          await billingChannel.send(question);
          const response = await billingChannel.awaitMessages({
            filter: (m) => m.author.id === interaction.user.id,
            max: 1,
          });

          embed.addFields({
            name: `${question}`,
            value: `${response.first().content}`,
          });
        }
        const channelMessages = await billingChannel.messages.fetch();

        channelMessages.forEach(async (message) => {
          await message.delete();
        });
        await billingChannel.send({ embeds: [embed] });
      } catch (e) {
        console.error(e);
      }
    } else if (choice === "report") {
      try {
        const reportChannel = await interaction.guild.channels.create({
          name: `report-${userName}`,
          type: ChannelType.GuildText,
          parent: process.env.ticketCategoryId,
        });
        await interaction.reply({
          content: `New report ticket opened @ <#${reportChannel.id}>`,
          ephemeral: true,
        });
        const embed = new EmbedBuilder()
          .setTitle("Report Questionare responses")
          .setDescription(
            "Below are all of the questions asked and all of the responses."
          )
          .setColor("Blue")
          .setFooter({
            text: `${userName}'s Report ticket`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        const reportQuestions = config.reportTicketQuestions;
        for (const question of reportQuestions) {
          await reportChannel.send(question);
          const response = await reportChannel.awaitMessages({
            filter: (m) => m.author.id === interaction.user.id,
            max: 1,
          });

          embed.addFields({
            name: `${question}`,
            value: `${response.first().content}`,
          });
        }
        const channelMessages = await reportChannel.messages.fetch();

        channelMessages.forEach(async (message) => {
          await message.delete();
        });
        await reportChannel.send({ embeds: [embed] });
      } catch (e) {
        console.error(e);
      }
    } else if (choice === "admin") {
      try {
        const adminChannel = await interaction.guild.channels.create({
          name: `admin-${userName}`,
          type: ChannelType.GuildText,
          parent: process.env.ticketCategoryId,
        });
        await interaction.reply({
          content: `New administrative support ticket opened @ <#${adminChannel.id}>`,
          ephemeral: true,
        });
        const embed = new EmbedBuilder()
          .setTitle("Administrative support Questionare responses")
          .setDescription(
            "Below are all of the questions asked and all of the responses."
          )
          .setColor("Blue")
          .setFooter({
            text: `${userName}'s Admin Support ticket`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        const purchaseQuestions = config.adminTicketQuestions;
        for (const question of purchaseQuestions) {
          await adminChannel.send(question);
          const response = await adminChannel.awaitMessages({
            filter: (m) => m.author.id === interaction.user.id,
            max: 1,
          });

          embed.addFields({
            name: `${question}`,
            value: `${response.first().content}`,
          });
        }
        const channelMessages = await adminChannel.messages.fetch();

        channelMessages.forEach(async (message) => {
          await message.delete();
        });
        await adminChannel.send({ embeds: [embed] });
      } catch (e) {
        console.error(e);
      }
    } else if (choice === "reset")
      return interaction.reply({
        content: "Now you are able to open any ticket type you want!",
        ephemeral: true,
      });
  },
};
