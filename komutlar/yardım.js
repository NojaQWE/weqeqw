const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../ayarlar.json')
exports.run = async (client, message, args) => { 
   const embed = new Discord.MessageEmbed()
   .setTitle("Rolia Klan üye Başvuru Sistemi")
   .addField("Klana Üye Olmak İçin Başvurun",`\`${ayar.prefix}başvur-üye\``)
  .addField("Başvuru sistemini aç/kapat",`\`${ayar.prefix}başvur-durum-üye aç/kapat\``)
  .addField("Başvuramıyacak kişileri engelle",`\`${ayar.prefix}başvur-ban-üye @kişi\``)
   .setThumbnail(client.user.avatarURL({dynamic:true}))
   .setFooter(`${message.author.tag} tarafından istendi`,message.author.avatarURL({dynamic:true,size:1024}));
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['help']
}
exports.help = {
  name: 'yardım-üye'
}