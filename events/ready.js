const Discord = require("discord.js");
const chalk = require("chalk");
const { get_electricity } = require("../utils/octopus/get_electricity");
const { toCost } = require("../utils/bot/tocost");

module.exports = async (client) => {
    console.log(chalk.green(`Logged in as ${client.user.tag}`));

    const electricity = await get_electricity();
    const kwh = electricity.results.reduce((acc, curr) => acc + curr.consumption, 0);
    const cost = toCost(kwh, 24.5);
    
    console.log(chalk.green(`Today you used ${kwh.toFixed(2)}kwh`));
    console.log(chalk.green(`Today you spent £${cost.toFixed(2)}`));

    client.user.setActivity(`£${cost.toFixed(2)} | ${kwh.toFixed(2)}`, { type: "WATCHING" });
};
