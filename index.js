/*
All Copyright ©️ GO'S To : Hamza
YOUTUBE CHANNEL : https://www.youtube.com/channel/UCixYMal9vvNUTVYHfR9SCGw
*/

const express = require('express');
const app = express();

app.listen(() => console.log('💕💕💕💕'));

app.use('/ping', (req, res) => {
	res.send(new Date());
});

const Discord = require('discord.js');
const Hamza = new Discord.Client();

const prefix = process.env.PREFIX;
const developers = process.env.DEVS;

Hamza.login(process.env.NTOKEN);

Hamza.on('ready', () => {
	console.log(`${Hamza.user.username}Im Ready!`);
});

Hamza.on('message', msg => {
	if (msg.content.startsWith(prefix + 'help')) {
		msg.author.send(`**\`\`\`Bot Commands\`\`\`
    🔥 ${prefix}bc
    🔥 ${prefix}setg
    🔥 ${prefix}sets
    🔥 ${prefix}setava
    🔥 ${prefix}setname
    🔥 ${prefix}leave**`);
		msg.react('✅');
	}
});

const adminprefix = prefix;

Hamza.on('message', async message => {
	var argresult = message.content
		.split(` `)
		.slice(1)
		.join(' ');
	if (!developers.includes(message.author.id)) return;

	if (message.content.startsWith(adminprefix + 'setg')) {
		Hamza.user.setGame(argresult);
		message.channel.send(`**✅   ${argresult}**`);
	} else if (message.content === adminprefix + 'leave') {
		message.guild.leave();
		console.error('طردوني و لاد الكلب 🤣🤣');
	} else if (message.content.startsWith(adminprefix + 'sets')) {
		Hamza.user.setGame(argresult, 'XXXXXXXXXX');
		message.channel.send(`**✅**`);
	}
	if (message.content.startsWith(adminprefix + 'setname')) {
		Hamza.user.setUsername(argresult).then;
		message.channel.send(`Changing The Name To ..**${argresult}** `);
	} else if (message.content.startsWith(adminprefix + 'setava')) {
		Hamza.user.setAvatar(argresult);
		message.channel.send(`Changing The Avatar To :**${argresult}** `);
	}
});

Hamza.on('message', async message => {
	var command = message.content.split(' ')[0];
	command = command.slice(prefix.length);
	if (!message.channel.guild) return;
	var args = message.content
		.split(' ')
		.slice(1)
		.join(' ');
	if (command == 'bc') {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.react('❌');
		}
		if (!args) {
			return message.reply(
				'**يجب عليك كتابة كلمة او جملة لإرسال البرودكاست 📃**'
			);
		}
		message.channel
			.send(
				`**هل أنت متأكد من إرسالك البرودكاست؟\nمحتوى البرودكاست: \`${args}\`**`
			)
			.then(m => {
				m.react('📢').then(() => m.react('❌'));

				let yesFilter = (reaction, user) =>
					reaction.emoji.name == '📢' && user.id == message.author.id;
				let noFiler = (reaction, user) =>
					reaction.emoji.name == '❌' && user.id == message.author.id;

				let yes = m.createReactionCollector(yesFilter);
				let no = m.createReactionCollector(noFiler);

				yes.on('collect', v => {
					m.delete();
					message.channel
						.send(
							`:ballot_box_with_check: | Done ... The Broadcast Message Has Been Sent For ${
								message.guild.memberCount
							} Members`
						)
						.then(msg => msg.delete(5000));
					message.guild.members.forEach(member => {
						let bc = new Discord.RichEmbed()
							.setColor('RANDOM')
							.setThumbnail(message.author.avatarURL)
							.setTitle('**Broadcast ✨**')
							.setDescription(
								`**aboone vous a ma chains [HERE](https://www.youtube.com/channel/UCixYMal9vvNUTVYHfR9SCGw)**`
							)
							.addField('**Server 🌀**', message.guild.name)
							.addField('**Sender 👨🏻‍💻**', message.author.username)
							.addField('**Message 📃**', args);

						member.sendEmbed(bc);
					});
				});
				no.on('collect', v => {
					m.delete();
					message.channel.send('**Broadcast Canceled ❌**');
					message.react('✅').then(msg => msg.delete(3000));
				});
			});
	}
});
