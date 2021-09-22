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
const TimeZoneOffset = parseInt(configfile.TimeZoneOffset * 3600)
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
    var tmpalerts = fs.readdirSync('./queue/').filter(file => file.endsWith('.json'));
            for(const file of tmpalerts){
                fs.renameSync('./queue/' + file, './events/' + file)
                i++;
            }
    Scan();
    eventloop();
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
    } else {
    if(command === 'clear'){
        client.commands.get('clear').execute(message, Discord)
    } else {
        if(command === 'timetest'){{
            message.channel.send('Hosted machine time: ' + Math.floor(new Date().getTime()));
            message.channel.send('Time with offset: ' + Math.floor(new Date().getTime()/1000 + TimeZoneOffset))
        }}
    }
    }
    }
    }
    }
    }
})

//Functions

var tevent
function Scan(){
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
    fs.renameSync('./events/' + tdate + '.json', './queue/' + tdate + '.json')
    // sendalert(tdate, messagecontent)
}

//Event queing loop
async function eventloop(){
    for(;;){
        var qe = fs.readdirSync('./queue/')
        qe.sort()
        var t = qe[0]

        var events = fs.readdirSync('./events/')
        events.sort()

        if(events.length === 0 && qe.length === 0){
            await sleep(60000)
        } else {

        //Start pull events and check for event overides
        if(events.length >= 1 && qe.length < 1){
            fs.renameSync('./events/' +  events[0], './queue/' +  events[0])
            console.log(colors.green('Sucsessfully Loaded event ' + events[0] + ' and ready to alert'));
        } else {
            if(events.length >= 1 && qe.length >= 1 && qe[0] > events[0]){
                fs.renameSync('./queue/' + t, './events/' + t)
                fs.renameSync('./events/' + events[0], + './queue/' + events[0])
                console.log(colors.green('Replaced event ' + events[0] + ' with event ' + t + ' as it will accour sooner'));
            }
        }
        //End pull events and check for overide

        //Start Alert

        var qe = fs.readdirSync('./queue/')
        qe.sort()
        var t = qe[0]

        
        if(qe.length === 0){
            await sleep(60000)
        } else {

       if(qe.length >= 1){
            delete qe[0]
            qe.forEach(element =>{
                console.log('poop')
                fs.renameSync('./queue/' + qe[0], './events/' + qe[0])
            })
        }
        var json = JSON.parse(fs.readFileSync('./queue/' +  t))
        var messagecontent = JSON.parse(fs.readFileSync('./notifier/' + json.notifier)).text.toString()
        var teatime = json.epochtime.toString() //get it because the name of the variable was 't' and ttime sounds like tea time??? yeah? no? why?

        // console.log(Math.floor(new Date().getTime()/1000 + TimeZoneOffset))

        if(teatime <= Math.floor(new Date().getTime()/1000 + TimeZoneOffset)){
            client.channels.cache.get(eventchannelid.toString()).send(messagecontent)
            console.log(colors.green('Sucsessfully Alerted and moved event ' + t))
            fs.renameSync('./queue/' + t, './pastevents/' + t)
        }
        await sleep(60000)
        //End Alert
        }
    }
    }
}

function sleep(ms) { //https://stackoverflow.com/questions/14249506/how-can-i-wait-in-node-js-javascript-l-need-to-pause-for-a-period-of-time
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   
//End event queing loop



// function sendalert(tdate, messagecontent){ 
//     var cdate = Math.floor(new Date().getTime())/1000
//    fs.renameSync('./events/' + tdate + '.json', './tmpalerts/' + tdate + '.json', function(err){
//         if(err){
//             console.log(colors.red('Issue moving file ' + tdate +', aborting alert'))
//             return;
//         }
//     })
//     waitUntil(500, Infinity, function condition() {
//         cdate = Math.floor(new Date().getTime())/1000
//         var conditionthing = cdate >= tdate
//         return (conditionthing ? true : false);
//     }, function done(result) {
//         if(result === true){
//             client.channels.cache.get(eventchannelid.toString()).send(messagecontent)
//             console.log(colors.green('Sucsessfully Alerted and moved event ' + tdate))
//             fs.renameSync('./tmpalerts/' + tdate + '.json', './pastevents/' + tdate + '.json')
//             Scan();
//         }
//     });
// }

client.login(token);
