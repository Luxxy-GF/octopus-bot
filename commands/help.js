const Discord = require("discord.js");
const fs = require("fs");
module.exports = {
    name: "help",
    description: "Shows all commands",
    aliases: [""],
    async run(client, message, args) {
        const dir = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"));
        const helpEmbed = new Discord.EmbedBuilder()
            .setDescription("Here are the commands")
            .setColor(0x00ff00)
            .setFields({
                name: "Commands",
                value: dir.map((file) => {
                    const command = require(`./${file}`);
                    return `**${command.name}** - ${command.description || "No description"}`;
                }).join("\n")
            
            })
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            });
        message.reply({ embeds: [helpEmbed] });
    }
};
