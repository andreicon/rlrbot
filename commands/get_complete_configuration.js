const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "get_complete_configuration",
  aliases: ["complete_config"],
  description: "Display all configuration options",
  execute(message) {
    let configurations = AcUtil.getCompleteConfiguration(); // get the complete configuration from AcUtil
    
    let configurationsEmbed = new MessageEmbed() // create the message for Discord
    .setTitle("Server configurations")
    .setDescription("List of all server configurations")
    .setColor("#F8AA2A");

    configurationsEmbed.addField('Server name:', `${configurations.SERVER.NAME}`, true); // add the server name to the message

    configurationsEmbed.addField('Track:', `${configurations.SERVER.TRACK} - ${configurations.SERVER.CONFIG_TRACK}`, true); // add the track to the message
    configurationsEmbed.addField('Cars:', configurations.SERVER.CARS, true); // add the cars to the message
      
    configurationsEmbed.setTimestamp(); // add the timestamp to the message
      
    return message.channel.send(configurationsEmbed).catch(console.error); // put the message
  }
};
  
