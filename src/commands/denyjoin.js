const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
require('dotenv').config();

const config = {
  description: 'Denies a user\'s join request.',
  aliases: ['deny', 'removejoin', 'dj', 'djoin'],
  usage: '<username>',
  rolesRequired: ['perm'],
  category: 'Join Requests'
}

module.exports = {
  config,
  run: async (client, message, args) => {
    let embed = new Discord.MessageEmbed();

    let username = args[0];
    if (!username) {
      embed.setDescription(`Missing arguments.\n\nUsage: \`${client.config.prefix}${path.basename(__filename).split('.')[0]}${' ' + config.usage || ''}\``);
      embed.setColor(client.config.colors.error);
      embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      return message.channel.send(embed);
    }

    let id;
    try {
      id = await roblox.getIdFromUsername(username);
    } catch (err) {
      embed.setDescription(`${username} is not a Roblox user.`);
      embed.setColor(client.config.colors.error);
      embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      return message.channel.send(embed);
    }

    let joinRequestInfo;
    try {
      joinRequestInfo = await roblox.handleJoinRequest(client.config.groupId, id, false);
    } catch (err) {
      console.log(`Error: ${err}`);
      embed.setDescription('There was an error handling that join request.');
      embed.setColor(client.config.colors.error);
      embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      return message.channel.send(embed);
    }

    embed.setDescription(`Denied ${username}'s join request.`);
    embed.setColor(client.config.colors.success);
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    message.channel.send(embed);

    if (client.config.logChannelId !== 'false') {
      let logEmbed = new Discord.MessageEmbed();
      let logChannel = await client.channels.fetch(client.config.logChannelId);
      logEmbed.setDescription(`**Moderator:** <@${message.author.id}> (\`${message.author.id}\`)\n**Action:** Denied Join Request\n**User:** ${username} (\`${id}\`)`);
      logEmbed.setColor(client.config.colors.info);
      logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      logEmbed.setTimestamp();
      logEmbed.setThumbnail(`https://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${username}`);
      return logChannel.send(logEmbed);
    } else {
      return;
    }
  }
}