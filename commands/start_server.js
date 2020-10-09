const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "start_server",
  aliases: ["start"],
  description: "Start a server from current configuration options",
  execute(message) {
    let configurations = AcUtil.getCompleteConfiguration();
    AcUtil.startAcserverProcess()
    
    let configurationsEmbed = new MessageEmbed()
    .setTitle("Starting server")
    .setColor("#F8AA2A");

    configurationsEmbed.addField('Server name:', `${configurations.SERVER.NAME}`, true);
    configurationsEmbed.addField('Track:', `${configurations.SERVER.TRACK} ${configurations.SERVER.CONFIG_TRACK ? `- ${configurations.SERVER.CONFIG_TRACK}` : ''}`, true);
    configurationsEmbed.addField('Cars:', configurations.SERVER.CARS, true);
      
    configurationsEmbed.setTimestamp();
      
    return message.channel.send(configurationsEmbed).catch(console.error);
  }
};
  