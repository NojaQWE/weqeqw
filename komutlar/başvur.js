const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../ayarlar.json')
exports.run = async (client, message, args) => { 
    message.delete()
	const basvurdata = await db.get(`basvurbilgi`);
	if(basvurdata) return message.reply(`Başvurular geçici olarak durdurulmuştur.`);
	
	const bandata = await db.get(`ban.${message.author.id}`)
	if(bandata) return message.reply("Başvurulardan banlısın");
		
  let category = message.guild.channels.cache.get(ayar.basvurkategori);
            
  message.guild.channels.create(`${message.author.username}-başvur`, {
    parent: category,
    permissionOverwrites: [
        {id: ayar.everyoneid, deny: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
		{id: ayar.adminrol, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
        {id: message.author.id, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]}]
    }).then( async baschannel => {

    
  const sorular = [
    '**İsmini Ve Yaşını Oğrenebilirmiyim?** isim/yaş',
    '**Günde Kaç Saat Aktifsiniz?** 1/24 saat',
    '**Daha Önce Başka Bir Klanda Üye Oldunuzmu Olduysanız Klan İsimleri Nedir?** klan isim',
    '**Craftrise Sunucusunda Factions Oyununda Ne Kadardır Bulunuyorsunuz?**',
    '**Klan İle Birlikte Orman / Arena İnmeyi Düşünüyormusunuz?** evet/hayır',
    '**Eğer Klan Üyelerinden Herhangi Birisi Ormanda/Arenada Ölüyorsa Yardıma Gidecek misiniz?** evet/hayır',
    '**Eklemek İstediğiniz Bir Şeyler Varmı?** yazı/hayır',
    '**Neden Rolia?** <cevap>'
  ]
  let sayac = 0
  
  const filter = m => m.author.id === message.author.id
  const collector = new Discord.MessageCollector(baschannel, filter, {
    max: sorular.length,
    time: 5000 * 60
  })
  baschannel.send(`Merhaba ${message.author}, Demek Klanımıza Üye Olmak İstiyorsun, Ama Önce Bazı Soruları Cevaplamalısın!\nUnutma! Tüm Soruları Cevaplamak İçin Sadece __5__ Dakikan Var, Başarılar!`);
  baschannel.send(sorular[sayac++])
  collector.on('collect', m => {
    if(sayac < sorular.length){
      m.channel.send(sorular[sayac++])
    }
  })

  collector.on('end', collected => {
    if(!collected.size) return baschannel.send('**Süre Bitti!**\nBu kanal 5 saniye sonra silinecektir').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    baschannel.send('**Başvurunuz Başarıyla iletilmiştir!**\nBu kanal 5 saniye sonra silinecektir').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    let sayac = 0
    
    const onybuton = new disbut.MessageButton()
    .setLabel('Onayla')
    .setStyle('green')
    .setID('onay');
    const redbuton = new disbut.MessageButton()
    .setLabel('Reddet')
    .setStyle('red')
    .setID('red');
    let row = new disbut.MessageActionRow()
    .addComponents(onybuton, redbuton);

    const log = new Discord.MessageEmbed()
    .setAuthor(message.author.username + ` (${message.author.id})`, message.author.avatarURL({dynamic: true}))
	.setTitle('Yeni Başvuru Geldi!')
	.setDescription('Aşağıdaki butonlardan onay/red işlemlerini gercekleştirebilirsiniz')
    .setColor('BLUE')
    .addField('Başvuran Hakkında',[
       `**İsmini Ve Yaşını Oğrenebilirmiyim?: **\t\t${collected.map(m => m.content).slice(0,1)}`,
      `**Günde Kaç Saat Aktifsiniz?: **\t\t${collected.map(m => m.content).slice(1,2)}`,
      `**Daha Önce Başka Bir Klanda Üye Oldunuzmu Olduysanız Klan İsimleri Nedir?: **\t\t${collected.map(m => m.content).slice(2,3)}`,
      `**Craftrise Sunucusunda Factions Oyununda Ne Kadardır Bulunuyorsunuz?: **\t\t${collected.map(m => m.content).slice(3,4)}`,
	    `**Klan İle Birlikte Orman / Arena İnmeyi Düşünüyormusunuz?: **\t\t${collected.map(m => m.content).slice(4,5)}`,
      `**Eğer Klan Üyelerinden Herhangi Birisi Ormanda/Arenada Ölüyorsa Yardıma Gidecek misiniz?: **\t\t${collected.map(m => m.content).slice(5,6)}`,
      `**Eklemek İstediğiniz Bir Şeyler Varmı?:**\t\t${collected.map(m => m.content).slice(6,7)}`,
      `**Neden Rolia?:**\t\t${collected.map(m => m.content).slice(7,8)}`,
    ])
    .setTimestamp()
    .setFooter('Developed by Noja', message.guild.iconURL());
    client.channels.cache.get(ayar.yetkililog).send({
		buttons: [onybuton, redbuton],
	    embed: log}).then(async m => {
      db.set(`basvur.${m.id}`, message.author.id);
    })

  })
  
})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['başvuru']
}
exports.help = {
  name: 'başvur-üye'
}