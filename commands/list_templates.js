const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "list_templates",
  aliases: ["templates"],
  description: "Display all templates",
  execute(message) {
    let templates = AcUtil.listTemplates(); // get all templates from server
    
    let templatesEmbed = new MessageEmbed() // create new message
    .setTitle("Server templates")
    .setDescription("List of all server templates")
    .setColor("#F8AA2A");
    
    templates.forEach((template) => { // take each template
      templatesEmbed.addField( // add uuid, name, description to message
        `**${template.uuid}**`,
        `${template.name} - ${template.description}`,
        true
        );
      });
      
      templatesEmbed.setTimestamp(); // add timestamp to message
      
      return message.channel.send(templatesEmbed).catch(console.error); // put message to Discord
    }
  };
  
