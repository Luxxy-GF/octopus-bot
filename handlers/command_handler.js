const fs = require("fs");
const chalk = require("chalk");
const prefix = config.bot.prefix;
module.exports = async (client) => {
    const command_files = fs
        .readdirSync(`./commands/`)
        .filter((file) => file.endsWith(".js"));
    for (const file of command_files) {
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
        console.log(chalk.green(`Loaded command ${command.name}`));
    }
    console.log(chalk.green(`Loaded ${command_files.length} commands`));
    client.prefix = prefix;
};
