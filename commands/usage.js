const Discord = require("discord.js");
const { get_electricity } = require("../utils/octopus/get_electricity");
const { get_gas } = require("../utils/octopus/get_gas");
const { toCost } = require("../utils/bot/tocost");

module.exports = {
    name: "usage",
    description: "Shows your usage",
    aliases: [""],
    async run(client, message, args) {
        const electricity = await get_electricity();
        const gas = await get_gas();
        const electricityKwh = electricity.results.reduce((acc, curr) => acc + curr.consumption, 0);
        const gasKwh = gas.results.reduce((acc, curr) => acc + curr.consumption, 0);
        const electricityCost = toCost(electricityKwh, 24.5);
        const gasCost = toCost(gasKwh, 6.5);

        const usageEmbed = new Discord.EmbedBuilder()
            .setDescription("Here is your usage")
            .setColor(0x00ff00)
            .setFields(
                { name: "Electricity", value: `${electricityKwh.toFixed(2)}kwh\n£${electricityCost.toFixed(2)}` },
                { name: "Gas", value: `${gasKwh.toFixed(2)}kwh\n£${gasCost.toFixed(2)}` }
            )
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setFooter({
                text: "Powered by Octopus Energy",
                iconURL: "https://octopus.energy/assets/images/logo-hex.png"
            });
        message.reply({ embeds: [usageEmbed] });
    }
}