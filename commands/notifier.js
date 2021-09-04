const path = require('path')
const fs = require('fs')

module.exports = {
    name: 'notifier',
    description: 'Sets the message for an event',
    execute(message, args, Discord){

        const contents = message.content.split(/[ ,]/)

        if(contents[1] == 'help'){
            const newEmbed = new Discord.MessageEmbed() .setColor('#7C4CFF') .setTitle('Help') .setDescription('Help with !notifier') .addFields( {name: 'Add', value: 'Adds a notifier, !notifier add [Name] [Contents]'}, {name: 'Remove', value: 'Removes a notifier, !notifier remove [Name]'})
            message.channel.send(newEmbed)
        } else {
            if(contents[1] == 'add'){
                const Name = contents[2]
                var textstr = contents.slice(3).join(' ');
                var notifierARR = {
                    'name' : Name,
                    'text' : textstr
                }
    
                var notifierJSON = JSON.stringify(notifierARR)
    
                fs.writeFile('./notifier/' + Name + '.json', notifierJSON, function(err, result){
                    if(err){
                        const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to Create event') .addFields( {name: 'Reason', value: 'No idea what happened I just put this as the error callback for the writeFile function'})
                        message.channel.send(newEmbed)
                    } else {
                        const newEmbed = new Discord.MessageEmbed() .setColor('#12CB3C') .setTitle('Succsess!') .setDescription('Succsessfully Created notifier ' + Name) .setFooter('Saved as ' + Name + '.json')
                        message.channel.send(newEmbed)
                    }
                });
    
            } else {
                if(contents[1] == 'remove'){
                    const Name = contents[2]
                    const pathname = './notifier/' + Name + '.json'
                    const filename = path.basename(pathname)
    
                    fs.unlink(pathname, (err) => {
                        if(err){
                            const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to remove notifier') .addFields( {name: 'Reason', value: 'Invalid File Name'})
                            message.channel.send(newEmbed)
                        } else {
                            const embed = new Discord.MessageEmbed().setColor('#12CB3C').setTitle('Succsess!').setDescription('Notifier Removed Sucsessfully').addFields({name: 'Notifier Removed:', value: filename})
                            message.channel.send(embed)
                        }
                    })
                } else {
                    if(contents[1] == 'edit'){
                        var tfile = contents[2]
                        var notifierdir = fs.readdirSync('./notifier/')
                        console.log(notifierdir)
                    } else {
                        const newEmbed = new Discord.MessageEmbed() .setColor('#D82B00') .setTitle('Failure!') .setDescription('Failed to Use !notifier') .addFields( {name: 'Reason', value: 'Invalid syntax, do !notifier help for more'})
                        message.channel.send(newEmbed)
                    }
                }
            }
        }

    }
}