const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "get_server_status",
  aliases: ["status"],
  description: "Display server status",
  execute(message) {
    let configurations = AcUtil.getCompleteConfiguration(); // get server configuration
    let status = AcUtil.getServerStatus(); // get server status
    
    let configurationsEmbed = new MessageEmbed()
    .setTitle(configurations.SERVER.NAME)
    .setDescription(status)
    .setColor("#F8AA2A");
      
    configurationsEmbed.setTimestamp(); // add timestamp to message
      
    return message.channel.send(configurationsEmbed).catch(console.error); // put message in Discord
  }
};
  
