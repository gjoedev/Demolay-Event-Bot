module.exports = {
    name: 'list',
    description: 'Lists all active events',
    execute(message, args, Discord, fs){
        
        const contents = message.content.split(/[ ,]/);
        if(contents[1] == 'help'){
            const newEmbed = new Discord.MessageEmbed() .setColor('#7C4CFF') .setTitle('Help') .setDescription('Help with !list') .addFields( {name: 'Events', value: 'Lists active events, !list events'}, {name: 'Notifiers', value: 'Lists all notifiers, !list notifiers'})
            message.channel.send(newEmbed)
        }

        if(contents[1] == 'events'){
            var list = new Discord.MessageEmbed() .setColor('#004D7C') .setTitle('List') .setDescription('List of all active events')
            var i = 1
            var events = fs.readdirSync('./events/').filter(file => file.endsWith('.json'));
            var queued = fs.readdirSync('./queue/').filter(file => file.endsWith('.json')).sort()[0]
            if(queued != undefined){
                let rawdata = fs.readFileSync('./queue/' + queued);
                let cJSON = JSON.parse(rawdata);
                list.addFields({name: 'Queued Event ' + i, value: 'Name: ' + cJSON.name + ' Date: ' + cJSON.date + ' Time: ' + cJSON.time + ' Notifier: ' + cJSON.notifier})
            }
            if(queued == undefined && events.length === 0){
                list.addFields({name: 'No active events!', value: 'No inactive or queued events!'})
            } else {
                for(const file of events){
                    let rawdata = fs.readFileSync('./events/' + file);
                    let cJSON = JSON.parse(rawdata);
                    list.addFields({name: 'Event ' + i, value: 'Name: ' + cJSON.name + ' Date: ' + cJSON.date + ' Time: ' + cJSON.time + ' Notifier: ' + cJSON.notifier})
                    i++;
                }
            }
            message.channel.send(list);
        } else {
            if(contents[1] == 'notifiers'){
                var list = new Discord.MessageEmbed() .setColor('#004D7C') .setTitle('List') .setDescription('List of all active notifiers')
                var i = 1
                var events = fs.readdirSync('./notifier/').filter(file => file.endsWith('.json'));
                for(const file of events){
                    let rawdata = fs.readFileSync('./notifier/' + file);
                    let cJSON = JSON.parse(rawdata);
                    list.addFields({name : 'Notifier ' + i, value: cJSON.name})
                    i++;
                }
                message.channel.send(list);
            } else {
                const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to Use !list') .addFields( {name: 'Reason', value: 'Invalid syntax, do !list help for more'})
                message.channel.send(newEmbed)
            }
        }
    }
}