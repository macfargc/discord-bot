const { ActivityType } = require("discord.js");
const config = require("../../config.json");
module.exports = {
  name: "ready",
  async execute(client) {
    client.user.setActivity({
      name: client.guilds.cache.get(config.guildId).name || "GM Services",
      type: ActivityType.Watching,
    });
  },
};
