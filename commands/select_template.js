const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "select_template",
  aliases: ["select"],
  description: "Choose a template to overwrite server config from",
  usage: "/select_template uuid",
  execute(message, args) {
    let template = AcUtil.applyTemplatedConfiguration(args[0]); // apply the template given by uuid
    if (template) { // if the template was selected successfully
      return message.channel.send(`Template "${template.name}" applied`).catch(console.error); // return the name of the template
    } else { // return error message if template does not exist
      return message.channel.send(`Couldn't select template, dunno`).catch(console.error);
    }
  }
};
  
