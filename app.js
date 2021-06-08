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
    let icon;

    switch (index) {
        case 1:
            icon = '1️⃣';
            break;
        case 2:
            icon = '2️⃣';
            break;
        case 3:
            icon = '3️⃣';
            break;
        case 4:
            icon = '4️⃣'
            break;
        case 5:
            icon = '5️⃣';
            break;
        case 6:
            icon = '6️⃣';
            break;
        case 7:
            icon = '7️⃣';
            break;
        case 8:
            icon = '8️⃣'
            break;
    }

    return icon;
}

let busy = [];

setInterval(() => {
    axios({
        method: 'POST',
        url: 'https://status.wi-line.fr/update_machine_ext.php',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },

        data: 'action=READ_LIST_STATUS&serial_centrale=65e4444c3471550a789e2138a9e28eff'
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


        message += `\n\n *(dernier edit : ${moment().format('LLLL')})*`;
        client.guilds.fetch('748417085083877387').then(guild => {
            const channel = guild.channels.cache.get('851742655867781130');
            channel.messages.fetch('851750491692204033').then(msg => {
                msg.edit(message).then(() => {
                    console.log('Message édité!');
                }).catch(console.error);
            });
        });
    });
}, 10000);

client.login(process.env.TOKEN);