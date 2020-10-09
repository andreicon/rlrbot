const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "delete_template",
  aliases: ["delete"],
  description: "Delete a template",
  usage: "/delete_template uuid",
  execute(message, args) {
    if (args.length !== 1) {
      throw new Error(`Too many or too few arguments provided.\n\nUsage: ${this.usage}`);
    }
    AcUtil.deleteTemplateBasedOnUuid(args[0]);
    return message.channel.send(`Template ${args[0]} deleted`).catch(console.error);
  }
};
  