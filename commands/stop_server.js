const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "stop_server",
  aliases: ["stop"],
  description: "Stop currently running server",
  execute(message) {
    let returnMessage = "Server could not be stopped, contact the admin";
    if (AcUtil.postStopAcServer()) {
      returnMessage = "Server stopped"
    }
    
    let stopEmbed = new MessageEmbed()
    .setTitle(returnMessage)
    .setColor("#F8AA2A");

    stopEmbed.setTimestamp();
      
    return message.channel.send(stopEmbed).catch(console.error);
  }
};
  