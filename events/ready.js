const Discord = require("discord.js");
const chalk = require("chalk");

module.exports = async (client) => {
    console.log(chalk.green(`Logged in as ${client.user.tag}`));
    client.user.setActivity("with your heart", { type: "PLAYING" });
};
