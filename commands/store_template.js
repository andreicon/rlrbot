const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "store_template",
  aliases: ["store"],
  description: "Save configuration options to a template",
  usage: "/store_template \"Template title\" \"Template description\"",
  execute(message, args) {
    let argsParsed = args.join(' ').replace(/\"\s\"/g, '<split>').replace(/\"/g, "").split('<split>');
    if (argsParsed.length !== 2) {
      throw new Error(`Invalid name or description\n\nUsage: ${this.usage}`);
    }
    let template = AcUtil.storeCurrentConfigurationToANewTemplate({name: argsParsed[0], description: argsParsed[1]});
    if (template) {
      return message.channel.send(`Template saved as ${template.uuid}`).catch(console.error);
    }
    return message.channel.send(`Couldn't save template, dunno`).catch(console.error);
  }
};
  