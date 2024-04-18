require("dotenv").config();
const Discord = require("discord.js");
const { GatewayIntentBits, Partials } = require("discord.js");
const { get_electricity } = require("./utils/octopus/get_electricity");

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { toNanoDate } = require("influx")

const config = require("./config.json");

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildInvites
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User
    ]
});

global.config = config;
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

require("./handlers/command_handler")(client);
require("./handlers/event_handler")(client);
if (config.influx.enable){
    require('./utils/influx/data');
}

client.login(process.env.TOKEN);
