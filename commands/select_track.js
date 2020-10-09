const { MessageEmbed } = require("discord.js");
const AcUtil = require('../util/AcUtil');

module.exports = {
  name: "select_track",
  aliases: ["set_track"],
  description: "Choose a track",
  usage: "/select_track track_name",
  execute(message, args) {
    // let track = AcUtil.getTrack(args[0]);
    // TODO: check if this track exists
  
    AcUtil.postServerConfigById('track', args[0]);
    return message.channel.send(`Track "${args[0]}" selected`).catch(console.error);
  }
};
  