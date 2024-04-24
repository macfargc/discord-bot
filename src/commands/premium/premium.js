const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const db = new sqlite3.Database(path.join(__dirname, "codes.db"));
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("premium")
    .setDescription("Premium code checker commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("keycheck")
        .setDescription("Check information about a premium code")
        .addStringOption((option) =>
          option
            .setName("key")
            .setDescription("The premium code to check")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("usercheck")
        .setDescription("Check premium codes owned by a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to check")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("redeem")
        .setDescription("Redeem a premium code")
        .addStringOption((option) =>
          option
            .setName("key")
            .setDescription("The premium code to redeem")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("codecreate")
        .setDescription("Create a premium code")
        .addStringOption((option) =>
          option
            .setName("plan")
            .setDescription("The plan to create a code for")
            .setRequired(true)
            .addChoices(
              { name: "All Round Standard", value: "Standard" },
              { name: "All Round Advanced", value: "Advanced" },
              { name: "Fully Custom", value: "Custom" },
              { name: "RL Boost - Normal", value: "Normal" },
              { name: "RL Boost - With Rewards", value: "+Rewards" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("keyremove")
        .setDescription("Remove premium codes owned by a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove premium codes from")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === "keycheck") {
      // Code for keycheck subcommand from premium.js
      const key = interaction.options.getString("key");

      db.get("SELECT * FROM codes WHERE code = ?", [key], (err, row) => {
        if (err) {
          console.error("Error checking code:", err);
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Error")
            .setDescription(
              "An error occurred while checking the code. Please try again later."
            );
          interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } else if (!row) {
          const notFoundEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Code Not Found")
            .setDescription("The provided code was not found.");
          interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
        } else {
          const foundEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Code Information")
            .addFields(
              { name: "Owner", value: `<@${row.userId}>`, inline: true },
              { name: "Plan", value: row.plan, inline: true }
            );
          interaction.reply({ embeds: [foundEmbed], ephemeral: true });
        }
      });
    } else if (interaction.options.getSubcommand() === "usercheck") {
      // Code for usercheck subcommand from premium.js
      const user = interaction.options.getUser("user");

      db.all("SELECT * FROM codes WHERE userId = ?", [user.id], (err, rows) => {
        if (err) {
          console.error("Error checking user codes:", err);
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Error")
            .setDescription(
              "An error occurred while checking user codes. Please try again later."
            );
          interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } else if (!rows || rows.length === 0) {
          const notFoundEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("No Codes Found")
            .setDescription("No premium codes found for the specified user.");
          interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
        } else {
          const userCodesEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("User's Premium Codes")
            .setDescription(`Premium codes owned by <@${user.id}>:`);
          rows.forEach((row) => {
            userCodesEmbed.addFields(
              { name: "Code", value: row.code },
              { name: "Plan", value: row.plan },
              { name: "\u200B", value: "\u200B" } // Empty field for spacing
            );
          });
          interaction.reply({ embeds: [userCodesEmbed], ephemeral: true });
        }
      });
    } else if (interaction.options.getSubcommand() === "redeem") {
      // Code for redeem subcommand from redeem.js
      const key = interaction.options.getString("key");
      const userId = interaction.user.id;

      const logChannel = interaction.guild.channels.cache.get(
        process.env.logChannelId
      );
      if (!logChannel) {
        console.error("To use Premium commands, a log channel is required!");
        interaction.reply({
          content: "An error occurred. Please try again later.",
          ephemeral: true,
        });
        return;
      }

      db.get("SELECT * FROM codes WHERE code = ?", [key], (err, row) => {
        if (err) {
          console.error("Error redeeming code:", err);
          interaction.reply({
            content: "An error occurred. Please try again later.",
            ephemeral: true,
          });
        } else if (!row) {
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Invalid Code")
            .setDescription("Please check the code and try again.");
          interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } else if (row.userId) {
          const alreadyRedeemedEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Code Already Redeemed")
            .setDescription(
              `This code has already been claimed by <@${row.userId}>.`
            );
          interaction.reply({
            embeds: [alreadyRedeemedEmbed],
            ephemeral: true,
          });
        } else {
          db.run(
            "UPDATE codes SET userId = ? WHERE code = ?",
            [userId, key],
            (updateErr) => {
              if (updateErr) {
                console.error("Error updating code with userId:", updateErr);
                const errorEmbed = new EmbedBuilder()
                  .setColor("#FF0000")
                  .setTitle("Error")
                  .setDescription("An error occurred. Please try again later.");
                interaction.reply({ embeds: [errorEmbed], ephemeral: true });
              } else {
                const successEmbed = new EmbedBuilder()
                  .setColor("#00FF00")
                  .setTitle("Code Redeemed Successfully")
                  .setDescription("You have successfully redeemed the code!");
                interaction.reply({ embeds: [successEmbed], ephemeral: true });

                // Log to the log channel
                const logEmbed = new EmbedBuilder()
                  .setColor("#FFFF00")
                  .setTitle("Premium Code Redeemed")
                  .setDescription(`<@${userId}> redeemed a premium code.`)
                  .addFields({ name: "Code", value: key });
                logChannel.send({ embeds: [logEmbed] });
              }
            }
          );
        }
      });
    } else if (interaction.options.getSubcommand() === "codecreate") {
      // Code for codecreate subcommand from codeCreate.js
      const plan = interaction.options.getString("plan");

      function generateCode(length) {
        let result = "";
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      }

      function checkUniqueCode(code) {
        return new Promise((resolve, reject) => {
          db.get(
            "SELECT COUNT(*) AS count FROM codes WHERE code = ?",
            [code],
            (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row.count === 0);
              }
            }
          );
        });
      }

      async function generateUniqueCode() {
        let code = generateCode(20);
        while (!(await checkUniqueCode(code))) {
          code = generateCode(20);
        }
        return code;
      }

      const uniqueCode = await generateUniqueCode();

      db.run(
        "INSERT INTO codes (code, plan) VALUES (?, ?)",
        [uniqueCode, plan],
        (err) => {
          if (err) {
            console.error("Error inserting code into database:", err);
            const errorEmbed = new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Error")
              .setDescription(
                "An error occurred while generating the code. Please try again later."
              );
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          } else {
            const successEmbed = new EmbedBuilder()
              .setColor("#00FF00")
              .setTitle("Code Generated Successfully")
              .setDescription("Here is your generated code:")
              .addFields(
                { name: "Code", value: uniqueCode },
                { name: "Plan", value: plan }
              );
            interaction.reply({ embeds: [successEmbed], ephemeral: true });

            // Log code creation
            const logChannel = interaction.guild.channels.cache.get(
              process.env.logChannelId
            );
            if (!logChannel) {
              console.error("Log channel not found.");
              return;
            }
            const logEmbed = new EmbedBuilder()
              .setColor("#FFFF00")
              .setTitle("Code Generated")
              .setDescription("A premium code was generated.")
              .addFields(
                { name: "Code", value: uniqueCode },
                { name: "Plan", value: plan }
              );
            logChannel.send({ embeds: [logEmbed] });
          }
        }
      );
    } else if (interaction.options.getSubcommand() === "keyremove") {
      // Code for keyremove subcommand
      const user = interaction.options.getUser("user");

      if (!interaction.member.permissions.has("ADMINISTRATOR")) {
        const noPermissionEmbed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Insufficient Permissions")
          .setDescription(
            "You must have administrator permissions to remove keys."
          );
        interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        return;
      }

      db.all("SELECT * FROM codes WHERE userId = ?", [user.id], (err, rows) => {
        if (err) {
          console.error("Error checking user codes:", err);
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Error")
            .setDescription(
              "An error occurred while checking user codes. Please try again later."
            );
          interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } else if (!rows || rows.length === 0) {
          const noKeysEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("No Keys Found")
            .setDescription(`No premium codes found for <@${user.id}>.`);
          interaction.reply({ embeds: [noKeysEmbed], ephemeral: true });
        } else {
          const removedKeys = rows
            .map((row) => `${row.code} - ${row.plan}`)
            .join("\n");

          // Displaying keys and awaiting user input

          const keysList = rows
            .map((row) => `Key: ${row.code} | Plan: ${row.plan}`)
            .join("\n");
          const promptEmbed = new EmbedBuilder()
            .setColor("#FFFF00")
            .setTitle("Remove Keys")
            .setDescription(
              `Please send the key you would like to remove for <@${user.id}>, or type "all" to remove all keys.\n\n${keysList}`
            );

          interaction
            .reply({ embeds: [promptEmbed], ephemeral: true })
            .then(() => {
              const filter = (msg) => msg.author.id === interaction.user.id;
              const collector = interaction.channel.createMessageCollector({
                filter,
                time: 60000,
              }); // 60 seconds timeout

              collector.on("collect", (msg) => {
                const keyToRemove = msg.content.trim();
                collector.stop();
                msg.delete();
                if (keyToRemove === "all") {
                  db.run(
                    "DELETE FROM codes WHERE userId = ?",
                    [user.id],
                    (deleteErr) => {
                      if (deleteErr) {
                        console.error("Error removing keys:", deleteErr);
                        const errorEmbed = new EmbedBuilder()
                          .setColor("#FF0000")
                          .setTitle("Error")
                          .setDescription(
                            "An error occurred while removing keys. Please try again later."
                          );
                        interaction.channel.send({ embeds: [errorEmbed] });
                      } else {
                        const removedKeysEmbed = new EmbedBuilder()
                          .setColor("#00FF00")
                          .setTitle("Keys Removed Successfully")
                          .setDescription(
                            `Removed all keys from <@${user.id}>.`
                          );
                        interaction.channel.send({
                          embeds: [removedKeysEmbed],
                        });
                      }
                    }
                  );
                } else {
                  // Remove specific key
                  const keyExists = rows.some(
                    (row) => row.code === keyToRemove
                  );

                  const logChannel = interaction.guild.channels.cache.get(
                    process.env.logChannelId
                  );
                  if (!logChannel) {
                    console.error("Log channel not found.");
                    return;
                  }
                  const logEmbed = new EmbedBuilder()
                    .setColor("#FFFF00")
                    .setTitle("Code Removed")
                    .setDescription("All of a user's keys were deleted.")
                    .addFields(
                      {
                        name: `Administrator: `,
                        value: `<@${interaction.user.id}>`,
                      },
                      { name: "Target: ", value: `<@${user.id}>` }
                    );

                  logChannel.send({ embeds: [logEmbed] });
                  if (!keyExists) {
                    interaction.channel.send(
                      "The specified key does not exist."
                    );
                    return;
                  }

                  db.run(
                    "DELETE FROM codes WHERE userId = ? AND code = ?",
                    [user.id, keyToRemove],
                    (deleteErr) => {
                      if (deleteErr) {
                        console.error("Error removing key:", deleteErr);
                        const errorEmbed = new EmbedBuilder()
                          .setColor("#FF0000")
                          .setTitle("Error")
                          .setDescription(
                            "An error occurred while removing the key. Please try again later."
                          );
                        interaction.channel.send({ embeds: [errorEmbed] });
                      } else {
                        const removedKeyEmbed = new EmbedBuilder()
                          .setColor("#00FF00")
                          .setTitle("Key Removed Successfully")
                          .setDescription(
                            `Removed key "${keyToRemove}" from <@${user.id}>.`
                          );
                        const response = interaction.channel.send({
                          embeds: [removedKeyEmbed],
                        });

                        const logChannel = interaction.guild.channels.cache.get(
                          process.env.logChannelId
                        );
                        if (!logChannel) {
                          console.error("Log channel not found.");
                          return;
                        }
                        const logEmbed = new EmbedBuilder()
                          .setColor("#FFFF00")
                          .setTitle("Code Removed")
                          .setDescription("A premium code was removed.")
                          .addFields(
                            {
                              name: `Key: ${keyToRemove}`,
                              value: `From: <@${user.id}>`,
                            },
                            {
                              name: `Administrator: `,
                              value: `<@${interaction.user.id}>`,
                            }
                          );
                        logChannel.send({ embeds: [logEmbed] });
                      }
                    }
                  );
                }
              });

              collector.on("end", (collected, reason) => {
                if (reason === "time") {
                  interaction.channel.send("You took too long to respond.");
                }
              });
            });
        }
      });
    }
  },
};
