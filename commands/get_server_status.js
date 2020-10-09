const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "get_server_status",
  aliases: ["server_status", "status"],
  description: "Display server status",
  execute(message) {
    let configurations = AcUtil.getCompleteConfiguration();
    let status = AcUtil.getServerStatus();
    
    let configurationsEmbed = new MessageEmbed()
    .setTitle(configurations.SERVER.NAME)
    .setDescription(status)
    .setColor("#F8AA2A");
      
    configurationsEmbed.setTimestamp();
      
    return message.channel.send(configurationsEmbed).catch(console.error);
  }
};
  