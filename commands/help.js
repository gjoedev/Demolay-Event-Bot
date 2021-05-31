const { description } = require("./event");

module.exports = {
    name: 'help',
    description: 'General Help',
    execute(message, args, Discord, fs){
        const newEmbed = new Discord.MessageEmbed() .setColor('#7C4CFF') .setTitle('Help') .setDescription('General Help') .addFields( {name: 'Event', value: 'Allows for creation and removal of events, !event create help or !event remove help'}, {name: 'Notifier', value: 'Allows for creation and removal of notifiers, !notifier help'}, {name: 'List', value: 'Lists events and notifiers, !list help'})
        message.channel.send(newEmbed)
    }
}