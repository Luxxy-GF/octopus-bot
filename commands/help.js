const Discord = require('discord.js')
module.exports = {
    name: "help",
    aliases: [''], 
    async run(client, message, args){
        const helpEmbed = new Discord.EmbedBuilder()
        .setDescription('Here are the commands')
        .setColor(0x00ff00)
        .setFields(
            {name: 'Commands', value: 'ping, help, ban, kick'}
        )
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        message.reply({ embeds: [helpEmbed] })
    }
}