const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "list_templates",
  aliases: ["templates"],
  description: "Display all templates",
  execute(message) {
    let templates = AcUtil.listTemplates();
    
    let templatesEmbed = new MessageEmbed()
    .setTitle("Server templates")
    .setDescription("List of all server templates")
    .setColor("#F8AA2A");
    
    templates.forEach((template) => {
      templatesEmbed.addField(
        `**${template.uuid}**`,
        `${template.name} - ${template.description}`,
        true
        );
      });
      
      templatesEmbed.setTimestamp();
      
      return message.channel.send(templatesEmbed).catch(console.error);
    }
  };
  