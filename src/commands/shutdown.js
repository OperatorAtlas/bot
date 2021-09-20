const Discord = require('discord.js');
const client = new Discord.Client({ allowedMentions: { parse: [] } });
require("dotenv").config();

const config = {
  description: 'Shuts the bot down.',
  aliases: ['sd', 'shutd', 'sdown', 'shut', 'fuckyou'],
  usage: '',
  rolesRequired: ['shut'],
  category: 'Other'
}

module.exports = {
  config,
  run: async (client, message, args) => {
    let embed = new Discord.MessageEmbed();
    embed.setDescription(`Shutting down this bitch ass bot`);
    embed.setColor(client.config.colors.success);
    message.channel.send(embed);
    client.destroy();
  }
}