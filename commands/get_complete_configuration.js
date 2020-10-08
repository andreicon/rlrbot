const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "get_complete_configuration",
  aliases: ["complete_config"],
  description: "Display all configuration options",
  execute(message) {
    let configurations = AcUtil.getCompleteConfiguration();
    
    let configurationsEmbed = new MessageEmbed()
    .setTitle("Server configurations")
    .setDescription("List of all server configurations")
    .setColor("#F8AA2A");

    configurationsEmbed.addField('Server name:', `${configurations.SERVER.NAME}`, true);

    configurationsEmbed.addField('Track:', `${configurations.SERVER.TRACK} - ${configurations.SERVER.CONFIG_TRACK}`, true);
    configurationsEmbed.addField('Cars:', configurations.SERVER.CARS, true);
      
    configurationsEmbed.setTimestamp();
      
    return message.channel.send(configurationsEmbed).catch(console.error);
  }
};
  