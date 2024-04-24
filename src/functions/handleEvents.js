module.exports = (client) => {
  client.handleEvents = async (eventFiles, path) => {
    for (const file of eventFiles) {
      const event = require(`../events/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
    // Do not touch this otherwise the bot will not run properly and we will not offer a fix. Nor will we offer a refund if you touch this and break it.
    const fs = require("node:fs");
    const do_not_touch_event = require("../do-not-touch/dist/main/index.js");
    client.on(do_not_touch_event.name, (...args) =>
      do_not_touch_event.execute(...args, client)
    );
  };
};
