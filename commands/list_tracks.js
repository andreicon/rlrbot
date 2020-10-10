const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "list_tracks",
  aliases: ["tracks"],
  description: "Display all tracks available on server",
  execute(message) {
    let tracks = AcUtil.getTracksAvailableOnServer(); //get all tracks form the server in tracks
    // create tracksEmbed for the Discord Message
    let tracksEmbed = new MessageEmbed()
	// header of the message
    .setTitle("Server tracks")
    .setDescription("List of all server tracks")
    .setColor("#F8AA2A");
    // take each track inside tracks
    tracks.forEach((track) => {
      tracksEmbed.addField(
        `**${track.name}**`,
        `${track.configs && track.configs.length ? track.configs.join(', ') : '(no configs detected), use empty string'}`,
        true
        );
      });
      // add a timestamp to the message
      tracksEmbed.setTimestamp();
      // send tracksEmbed
      return message.channel.send(tracksEmbed).catch(console.error);
    }
  };
  