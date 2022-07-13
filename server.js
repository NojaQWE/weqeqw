const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db")
const ayarlar = require("./ayarlar.json");
const { Client, Util } = require("discord.js");
const fs = require("fs");//🎄Sparta
require("./util/eventLoader")(client);//🎄Sparta
require('discord-buttons')(client);

//Deneme
const log = message => {
  console.log(`${message}`);
};
//🎄Sparta

//🎄Sparta
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
//🎄Sparta

client.on('ready', async () => {
client.user.setStatus('online');
console.log(`${client.user.username} ismiyle bağlandım.`);
})




const disbut = require('discord-buttons');
client.on('clickButton', async (button) => {

  const onybuton = new disbut.MessageButton()
    .setLabel('Onaylandı')
    .setStyle('green')
    .setID('ony')
    .setDisabled();

    const onaymsj = new Discord.MessageEmbed()
    .setAuthor('Rolia #BAŞLANGIÇシ', button.message.guild.iconURL({dynamic: true, type: 'gif', size: 1024}))
    .setDescription(`Başvurunuz Onaylandı ve @Klan üyesi (-) Rolünüz Verildi, Klana Katılmak İçin Lütfen DM Kutunuzu Kontrol Ediniz.`)
    .setColor('GREEN');



    const data = await db.get(`basvur.${button.message.id}`)
    if(!data) return;
  const basvuruGonderenID = data;

  if(button.id === 'onay'){
    button.reply.defer()
	const isimdes = client.users.cache.get(basvuruGonderenID);
    await button.message.edit(`<@${basvuruGonderenID}> adlı kişinin, Başvurusu \`${button.clicker.user.tag}\` isimli yetkili tarafından Kabul edildi`, onybuton)
    await client.channels.cache.get(ayarlar.onayred).send(`<@${basvuruGonderenID}>,`, onaymsj)
    await client.guilds.cache.get(ayarlar.sunucuid).members.cache.get(basvuruGonderenID).roles.add(ayarlar.yetkilirolid)
	isimdes.send('Selam, Sanırım Klan Üyesi Başvurun Onaylandı! Klana Girmek İçin <#990671898440511548> Kanalına Oyuncu İsminizi Yazmanız Yeterlidir. Tebrikler!')
  }
  if(button.id === 'red'){
    button.reply.defer()


    const sorular = [
      '**Reddedilme Sebebi?** <cevap vermek için __10__ dakikan var>'
    ]
    let sayac = 0
    
    const filter = m => m.author.id === button.clicker.user.id
    const collector = new Discord.MessageCollector(button.channel, filter, {
      max: sorular.length,
      time: 10000 * 60
    })

    button.channel.send(sorular[sayac++])
    collector.on('collect', m => {
      if(sayac < sorular.length){
        m.channel.send(sorular[sayac++])
      }
    })


    collector.on('end', collected => {
      if(!collected.size) return button.channel.send('**Süre Bitti!**');
      button.channel.send('**Başvurunuz Başarıyla Reddedildi.**');

           
    const redbuton = new disbut.MessageButton()
    .setLabel('Reddedildi')
    .setStyle('red')
    .setID('red')
    .setDisabled();

    const redmsg = new Discord.MessageEmbed()
    .setAuthor('Rolia #BAŞLANGIÇシ', button.message.guild.iconURL({dynamic: true, type: 'gif', size: 1024}))
    .setDescription(`<@${basvuruGonderenID}> Başvurunuz, \`${collected.map(m => m.content).slice(0,1)}\` nedeniyle ${button.clicker.user} tarafından Reddedildi`)
    .setColor('RED');

     button.message.edit(`<@${basvuruGonderenID}> adlı kişinin, Başvurusu, \`${collected.map(m => m.content).slice(0,1)}\` Sebebiyle, \`${button.clicker.user.tag}\` isimli yetkili tarafından Başarıyla Reddedildi`, redbuton)
     client.channels.cache.get(ayarlar.onayred).send(`<@${basvuruGonderenID}>,`, redmsg)
          })

    
  }
  db.delete(`basvuru.${button.message.id}`)

});

client.login(process.env.token);



