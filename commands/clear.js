const fs = require('fs')
module.exports = {
    name: 'clear',
    description: 'Clears past events',
    execute(message, Discord){
        var pastevents = fs.readdirSync('./pastevents/').filter(file => file.endsWith('.json'))
        pastevents.forEach(element =>{
            fs.unlink('./pastevents/' + element, function(err, result){
                if(err){
                    const embed = new Discord.MessageEmbed().setTitle('Failure').setColor('#D82B00').setDescription('Ran into an error while trying to remove ```' + element + '``` with error code ```' + err.toString() + '```' )
                    message.channel.send(embed)
                    return;
                }
            })
        })
        const embed = new Discord.MessageEmbed().setColor('#12CB3C').setTitle('Succsess!').setDescription('Succsessfully removed all past events!').setDescription('Removed ```' + pastevents.length.toString() + '``` events from ```./pastevents/```')
        message.channel.send(embed)
    }
}