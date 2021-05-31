module.exports = {
    name: 'ping',
    description: 'test',
    execute(message, args){
        message.channel.send('pong or something');
    }
}