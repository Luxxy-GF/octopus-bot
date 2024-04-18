const Discord = require("discord.js");
const { get_electricity } = require("../utils/octopus/get_electricity");
const PrettyTable = require("../utils/bot/table");
const moment = require("moment");

function batchArray(array, batchSize) {
    const batchedArray = [];
    for (let i = 0; i < array.length; i += batchSize) {
        batchedArray.push(array.slice(i, i + batchSize));
    }
    return batchedArray;
}

module.exports = {
    name: "energyinfo",
    description: "Get energy consumption",
    aliases: ["einfo"],
    async run(client, message, args) {
        const HEADERS = ["date", "consumption"];

        const get_from_meter = await get_electricity();

        const batches = batchArray(get_from_meter.results, 15);

        console.log("Got ", batches.length, " batches");
        for (const batch of batches) {
            console.log("Batch: ", batch.length, " items");
            const table = new PrettyTable();
            table.create(
                HEADERS,
                batch.map((result) => [
                    moment(result.interval_start).format("HH:mm"),
                    result.consumption
                ])
            );
            message.channel.send("```" + table.toString() + "```");
        }
    }
};
