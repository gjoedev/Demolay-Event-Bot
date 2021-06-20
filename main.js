//Config
const async = require('async');
const Discord = require('discord.js');
const client = new Discord.Client();
const colors = require('colors')
const prefix = '!';
const fs = require('fs');
const waitUntil = require('wait-until')

try {
    const configfile = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
} catch (err){
    if(err.code === 'ENOENT'){
        console.log(colors.red('No config.json file found. This file is critical, as it contains key info for the bot to start. If you have renamed or removed config.json, please re-add it. If you need further assitance, vist [future support link here]. Exiting with code 1'))
        process.exit(1)
    } else {
        console.log(colors.red('An error was encountered when trying to read config.json, This error is unknown, so there isnt an instant solution. If you need further assitance, please DM me VIA Discord at gjoe#8991. Exiting with code 1'))
        throw(err)
        process.exit(1)
    }
}
const configfile = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
const token = configfile.token
const eventchannelid = configfile.EventChannelID
const TimeZoneOffset = parseInt(configfile.TimeZoneOffset)
module.exports = { Scan, TimeZoneOffset };
//End Config


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command)
}

client.once('ready', () =>{
    console.log(colors.green('Logged in at ' + token));
    var i = 0
    var tmpalerts = fs.readdirSync('./tmpalerts/').filter(file => file.endsWith('.json'));
            for(const file of tmpalerts){
                fs.renameSync('./tmpalerts/' + file, './events/' + file)
                i++;
            }
    Scan();
    client.user.setActivity("The time...", {
        type: "WATCHING"
    });
})
client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot || message.channel instanceof Discord.DMChannel) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping'){
        client.commands.get('ping').execute(message, args);
    } else {
    if(command === 'event'){
        client.commands.get('event').execute(message, args, Discord, fs);
    }
    if(command === 'list' || command === 'events'){
    client.commands.get('list').execute(message, args, Discord, fs);
    } else {
    if(command === 'notifier'){
        client.commands.get('notifier').execute(message, args, Discord, fs);
    } else {
    if(command === 'help'){
        client.commands.get('help').execute(message, args, Discord, fs);
    } else {
    if(command === 'forcescan'){
        Scan()
    }
    }
    }
    }
    }
})

//Functions

var tevent
function Scan(){
    if(fs.readdirSync('./tmpalerts/').length >= 1){
        console.log(colors.yellow('One event is already queued, not adding extra events to avoid memory exhaustion (Simply remove this If statement if the machine your running has more then enough RAM)'))
        return;
    }
    if(fs.readdirSync('./events/').length === 0){
        console.log(colors.yellow('Events Folder Empty, Skipping Scan'))
    } else {
        var events = fs.readdirSync('./events/').filter(file => file.endsWith('.json'))
                for(const file of events){                    
                    let rawdata = fs.readFileSync('./events/' + file);
                    if(rawdata.length === 0){
                        console.log(colors.yellow('File ' + file + ' Is empty, removing file from events'))
                        fs.unlinkSync('./events/' + file, function(err){
                            if(err){console.log(colrs.red('Cannot remove file ' + file + ', Pleave mannualy remove.'))}
                        })
                        
                    }
                }
                events = fs.readdirSync('./events/').filter(file => file.endsWith('.json'))
                events.sort()
                if(events.length === 0){
                    console.log(colors.yellow('After changes (Most likely removal of empty event files), the events folder was found empty. Stopping alert process.'))
                } else {
                    tevent = events[0]
                    StartAlerter()
                }
                }
}


function StartAlerter(){
    var rawdata = fs.readFileSync('./events/' + tevent)
    var cJSON = JSON.parse(rawdata)
    var notifier = cJSON.notifier
    var tdate = cJSON.epochtime
    var messagefile = JSON.parse(fs.readFileSync('./notifier/' + notifier, function(err){
        if(err) console.log('Issue with loading message file, setting to null'.red)
        console.log('Message file failed to load: ' + './notifier' + notifier)
    }));
    var messagecontent = messagefile.text.toString()
    console.log(colors.green('Sucsessfully Loaded event ' + tdate + ' and ready to alert'))
    sendalert(tdate, messagecontent)
}

function sendalert(tdate, messagecontent){ 
    var cdate = Math.floor(new Date().getTime())/1000
   fs.renameSync('./events/' + tdate + '.json', './tmpalerts/' + tdate + '.json', function(err){
        if(err){
            console.log(colors.red('Issue moving file ' + tdate +', aborting alert'))
            return;
        }
    })
    waitUntil(500, Infinity, function condition() {
        cdate = Math.floor(new Date().getTime())/1000
        var conditionthing = cdate >= tdate
        return (conditionthing ? true : false);
    }, function done(result) {
        if(result === true){
            client.channels.cache.get(eventchannelid.toString()).send(messagecontent)
            console.log(colors.green('Sucsessfully Alerted and moved event ' + tdate))
            fs.renameSync('./tmpalerts/' + tdate + '.json', './pastevents/' + tdate + '.json')
            Scan();
        }
    });
}

client.login(token);
