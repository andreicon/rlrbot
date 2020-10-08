const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "select_template",
  aliases: ["select"],
  description: "Choose a template to overwrite server config from",
  usage: "/select_template uuid",
  execute(message, args) {
    let template = AcUtil.applyTemplatedConfiguration(args[0]);
    if (template) {
      return message.channel.send(`Template "${template.name}" applied`).catch(console.error);
    }
    return message.channel.send(`Couldn't select template, dunno`).catch(console.error);
  }
};
  