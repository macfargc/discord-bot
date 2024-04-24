const { ActivityType } = require("discord.js");
require("dotenv").config();
module.exports = {
  name: "ready",
  async execute(client) {
    client.user.setActivity({
      name: client.guilds.cache.get(process.env.guildId).name || "GM Services",
      type: ActivityType.Watching,
    });
  },
};
