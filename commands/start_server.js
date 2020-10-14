const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "start_server",
  aliases: ["start"],
  description: "Start a server from current configuration options",
  execute(message) {
    let configurations = AcUtil.getCompleteConfiguration(); // get the configuration from the server
    AcUtil.startAcserverProcess() // start the server
    // TODO: check if the server was started correctly
    let configurationsEmbed = new MessageEmbed() // create a message for Discord
    .setTitle("Starting server")
    .setColor("#F8AA2A");

    configurationsEmbed.addField('Server name:', `${configurations.SERVER.NAME}`, true); // add server name to message
    configurationsEmbed.addField('Track:', `${configurations.SERVER.TRACK} - ${configurations.SERVER.CONFIG_TRACK}`, true); // add track to message
    configurationsEmbed.addField('Cars:', configurations.SERVER.CARS, true); // add cars to message
      
    configurationsEmbed.setTimestamp(); // add timestamp to message
      
    return message.channel.send(configurationsEmbed).catch(console.error); // put message to Discord
  }
};
  
