const { MessageEmbed } = require("discord.js");
const childProcess = require("child_process");
module.exports = {
  name: "update",
  aliases: [],
  description: "Self update",
  execute(message) {
    childProcess.spawn('git', ['pull'], { cwd: process.cwd() } );

    let helpEmbed = new MessageEmbed()
      .setTitle("RLRbot Maintenance")
      .setDescription("Self Update Succeeded, bot will restart")
      .setColor("#F8AA2A");

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
