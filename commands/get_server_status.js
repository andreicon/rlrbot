const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "get_server_status",
  aliases: ["status"],
  description: "Display server status",
  execute(message) {
    let configurations = AcUtil.getCompleteConfiguration(); // get server configuration
    let status = AcUtil.getServerStatus(); // get server status
    
    let configurationsEmbed = new MessageEmbed() // create message for Discord
    .setTitle("Server configurations")
    .setDescription("List of all server configurations")
    .setColor("#F8AA2A");

    configurationsEmbed.addField('Server name:', `${configurations.SERVER.NAME}`, true); // add server name to message
    configurationsEmbed.addField('Status:', `${status}`, true); // add server status to message

    configurationsEmbed.addField('Track:', `${configurations.SERVER.TRACK} - ${configurations.SERVER.CONFIG_TRACK}`, true); // add track to message
    configurationsEmbed.addField('Cars:', configurations.SERVER.CARS, true); // add cars to message
      
    configurationsEmbed.setTimestamp(); // add timestamp to message
      
    return message.channel.send(configurationsEmbed).catch(console.error); // put message in Discord
  }
};
  
