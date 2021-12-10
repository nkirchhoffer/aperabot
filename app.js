require('dotenv').config();

const axios   = require('axios').default;
const discord = require('discord.js');
const client  = new discord.Client();
const moment  = require('moment');

moment.locale('fr');

client.on('ready', () => {
    console.log('Connecté :)');

});

const getIcon = index => {   
    const iconsMap = {
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣'
    }

    return iconsMap[index];
}



let busy = [];

setInterval(() => {
    axios({
        method: 'POST',
        url: 'https://status.wi-line.fr/update_machine_ext.php',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },

        data: `action=READ_LIST_STATUS&serial_centrale=${process.env.CENTRALE_SERIAL}`
    }).then(res => {
        const data = res.data;
        const machines = data.machine_info_status.machine_list;
        
        let message = ':sponge: **ETAT DES MACHINES - LAVERIE MDE** :sponge:\n';

        let i = 0; 
        busy = [];
        machines.forEach(machine => {
            if (i % 4 === 0) {
                message += '\n';
            }

            const icon = getIcon(i + 1);
            
            if (machine.status === 1) {
                message += `${icon} ${machine.nom_type}(${machine.selecteur_machine}) : :white_check_mark: \n`;
                busy.push(i);
            } else if (machine.status === 2) {
                message += `${icon} ${machine.nom_type}(${machine.selecteur_machine}) : :x: Occupé \n`;
                busy.push(i);
            } else {                
                let heure = moment().add(machine.time_before_off, 'seconds');

                message += `${icon} ${machine.nom_type}(${machine.selecteur_machine}) : :x: ${heure.format('LT')}  \n`;
            }

            i++;
        });

        const lastEdited = moment().format('LLLL');
        message += `\n\n *(dernier edit : ${lastEdited})*`;
        client.guilds.fetch(process.env.DISCORD_GUILD_ID).then(guild => {
            const channel = guild.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
            channel.messages.fetch(process.env.DISCORD_MESSAGE_ID).then(msg => {
                msg.edit(message).then(() => {
                    console.log(`Message édité : ${lastEdited} !`);
                }).catch(console.error);
            });
        });
    });
}, 10000);

client.login(process.env.DISCORD_OAUTH_TOKEN);