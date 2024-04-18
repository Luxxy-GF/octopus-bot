const chalk = require("chalk");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(client.prefix)) return;
    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;
    console.log(chalk.green(`Command ${command} ran`));
    cmd.run(client, message, args);
};
