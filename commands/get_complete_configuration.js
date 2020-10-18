const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "get_complete_configuration",
  aliases: ["complete_config", "get_config"],
  description: "Display all configuration options",
  execute(message) {
    let configurations = AcUtil.getCompleteConfiguration(); // get the complete configuration from AcUtil
    
    let configurationsEmbed = new MessageEmbed()
    .setTitle(configurations.SERVER.NAME)
    .setColor("#F8AA2A");

    configurationsEmbed.addField('Track:', `${configurations.SERVER.TRACK} ${configurations.SERVER.CONFIG_TRACK ? `- ${configurations.SERVER.CONFIG_TRACK}` : ''}`, true);
    configurationsEmbed.addField('Cars:', configurations.SERVER.CARS, true);

    let sessions = '' 
    if(configurations.PRACTICE && configurations.PRACTICE.TIME ) {
      sessions += "P: " + configurations.PRACTICE.TIME + " minutes ";
    }
    if(configurations.QUALIFY && configurations.QUALIFY.TIME ) {
      sessions += "Q: " + configurations.QUALIFY.TIME + " minutes ";
    }
    if(configurations.RACE && (configurations.RACE.TIME || configurations.RACE.LAPS) ) {
      sessions += "R: ";
      if (configurations.RACE.TIME !== "0") {
        sessions += configurations.RACE.TIME;
        sessions += ' minutes'; 
      } else if (configurations.RACE.LAPS !== "0") {
        sessions += configurations.RACE.LAPS;
        sessions += ' laps'; 
      }
    }
    configurationsEmbed.addField('Sessions:', sessions, true);

    configurationsEmbed.setTimestamp(); // add the timestamp to the message
      
    return message.channel.send(configurationsEmbed).catch(console.error); // put the message
  }
};
  
