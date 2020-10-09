const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "list_tracks",
  aliases: ["tracks"],
  description: "Display all tracks available on server",
  execute(message) {
    let tracks = AcUtil.getTracksAvailableOnServer();
    
    let tracksEmbed = new MessageEmbed()
    .setTitle("Server tracks")
    .setDescription("List of all server tracks")
    .setColor("#F8AA2A");
    
    tracks.forEach((template) => {
      tracksEmbed.addField(
        `**${track.name}**`,
        `${track.config.join(', ')}`,
        true
        );
      });
      
      tracksEmbed.setTimestamp();
      
      return message.channel.send(tracksEmbed).catch(console.error);
    }
  };
  