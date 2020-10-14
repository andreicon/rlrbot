const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Display all commands and descriptions",
  execute(message) {
    let commands = message.client.commands.array(); // get all commands

    let helpEmbed = new MessageEmbed() // create message for Discord
      .setTitle("RLRbot Help")
      .setDescription("List of all commands")
      .setColor("#F8AA2A");

    commands.forEach((cmd) => { // take each command
      helpEmbed.addField( // add command info to message
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp(); // add timestamp to message

    return message.channel.send(helpEmbed).catch(console.error); // put message to Discord
  }
};
