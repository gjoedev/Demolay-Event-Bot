const path = require('path')
const colors = require('colors')
const main = require('../main')
module.exports = {
    name: 'event',
    description: 'Creates or removes Events',
    execute(message, args, Discord, fs){
        const contents = message.content.split(/[ ,]+/);
        if(contents[1] == 'create'){
        const contents = message.content.split(/[ ,]+/);

        if(contents[2] == undefined || contents[3] == undefined && contents[2] != 'help' || contents[4] == undefined  && contents[2] != 'help' || contents[5] == undefined && contents[2] != 'help'){
            const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to Create event') .addFields( {name: 'Reason', value: 'Incorrect Syntax, do !create help for more information'})
            message.channel.send(newEmbed)
        } else {
            if(contents[2] == 'help'){
                const newEmbed = new Discord.MessageEmbed() .setColor('#7C4CFF') .setTitle('Help') .setDescription('Help with !create and examples') .addFields( {name: 'Illegal Characters:', value: 'Space : / Backslash * ? $ ^ |'}, {name: 'Event Name', value: 'Name of Event'}, {name: 'Event Date', value: 'Date of event, DD/MM/YYYY'}, {name: 'Event Time', value: 'Time of event alert, 24 Hour format, Uses time zone of host machine'}, {name: 'Notifier', value: 'Notifier Used to Alert People'})
                message.channel.send(newEmbed);
            } else {
                const name = contents[2];
                const date = contents[3];
                const dates = date.split('/')
                const time = contents[4];
                const times = time.split(/[:]+/)
                const notifier = contents[5]
		

                if(times[0] >= 13){
                    var displaytime = times[0] - 12 + ':' + times[1] + 'PM'
                } else {
                    var displaytime = times[0] + ':' + times[1] + 'AM'
                }
                var tdate = Math.floor(new Date(dates[2], dates[1] - 1, dates[0], +times[0] + +main.TimeZoneOffset, times[1]).getTime()/1000)
                var cdate = Math.floor(new Date().getTime() + main.TimeZoneOffset)/1000

                // if(dates[0] > 31 && contents[6] != "od" || dates[1] > 12 && contents[6] != "od"){
                //     const newEmbed = new Discord.MessageEmbed() .setColor('#FFB500') .setTitle('Warning!') .setDescription('Potential Date Failure') .addFields( {name: 'Reason', value: 'The Date/Month number isnt possible, its over the maximum amount of Dates/Months! To overide this, add "od" to the end of the date creation command.'})
                //     message.channel.send(newEmbed)
                //     return;
                // }


                if(cdate < tdate){
                    var event = {
                        'name' : name,
                        'date' : date,
                        'time' : time,
                        'epochtime' : tdate,
                        'notifier' : notifier + '.json'
                    }

                    var notifierdir = fs.readdirSync('./notifier')
                    if(!notifierdir.includes(notifier + '.json')){
                        const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to Create event') .addFields( {name: 'Reason', value: 'Invalid Notifier, do !list notifiers or !notifier help for more info'})
                        message.channel.send(newEmbed)
                    } else {
                        var eventstr = JSON.stringify(event)
                        var datename = dates[0] + '-' + dates[1] + '-' + dates[2]
                        var eventname = tdate
                        
                        fs.writeFileSync('./events/' + eventname + '.json' , eventstr, function(err, result) {
                            if(err) console.log(colors.red('error', err));
                        });
                        
                        const newEmbed = new Discord.MessageEmbed() .setColor('#12CB3C') .setTitle('Succsess!').setFooter('Saved as ' + eventname) .setDescription('Sucsessfully Created an Event!') .addFields( {name: 'Event Name', value: name}, {name: 'Event Date', value: date}, {name: 'Event Time', value: displaytime}, {name: 'Notifier', value: notifier})
                        message.channel.send(newEmbed)
                        main.Scan()
                    }

                } else {
                    const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to Create event') .addFields( {name: 'Reason', value: 'Cant create an event in the past'})
                    message.channel.send(newEmbed)
                }
            }
        }
        } else {
            if(contents[1] == 'remove'){
                const date = contents[2]
                const time = contents[3]
		console.log(date)

        
                if(contents[2] == undefined && contents[2] != 'help' || contents[3] == undefined && contents[2] != 'help'){
                    const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to remove event') .addFields( {name: 'Reason', value: 'Incorrect Syntax, do !remove help for more information'})
                    message.channel.send(newEmbed)
                } else {
            
                    if(contents[2] == 'help'){
                        const newEmbed = new Discord.MessageEmbed() .setColor('#7C4CFF') .setTitle('Help') .setDescription('Help with !remove') .addFields( {name: 'Event Date', value: 'Date of event, [DD/MM/YYYY] do !list events'}, {name: 'Event Time', value: 'Time of event, [HH:MM] 24 Hour format, do !list events'}, {name: 'Example', value: '!event remove 8/25/2036 17:30'})
                        message.channel.send(newEmbed);
                    } else {
                        const times = time.split(':')
                        const dates = date.split('/')
			console.log(times)
			console.log(dates)
                        const tepoch = new Date(dates[2], dates[1] -1, dates[0], times[0] + 4, times[1]).getTime()/1000
			console.log(tepoch)

                        const pathname = './events/' + tepoch + '.json'
                        const filename = path.basename(pathname)
                        fs.unlink(pathname, (err) => {
                            if (err) {
                                const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to remove event') .addFields( {name: 'Reason', value: 'Invalid File Name'})
                                message.channel.send(newEmbed)
                            } else {
                                const embed = new Discord.MessageEmbed().setColor('#12CB3C').setTitle('Succsess!').setDescription('Event Removed Sucsessfully').addFields({name: 'Event Removed:', value: filename})
                                message.channel.send(embed)
                                console.log(colors.green('Sucsessfully Removed ' + tepoch + ' Form events'))
                                main.Scan()
                            }
                        });
                    }
                }
            }
        }

    }
}
