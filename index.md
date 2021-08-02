---
layout: deafault
---

## Demolay Event Bot
### About
The demolay event bot is a Discord Bot I set up that allows Demolay chapters with their own discord servers to organize their events with this bot. Its somewhat easy to set up, and the documentation can be found [Here](https://1drv.ms/w/s!ArXnJdAp_FG1hvRZzKuX1keBNcthzA?e=5zOn43). If you need further help, contact me VIA discord at gjoe#0001

### Technical Details
The demolay event bot uses the [Discord.JS framework](https://discord.js.org/#/) and the [Discord API](https://discord.com/developers/docs/intro) to create a bot that allows users to organize events, and not have to worry about mannualy alerting them, as the bot will do it for the chapter. For me, this was a huge techincal challange, as this is the first major Javascript project I've completed. The bot takes advantage of Javascripts async await abilities, for example:
```js
await return new Promise((resolve) => {
    setTimeout(resolve, 60000)
})
```
Although this may be simple for an *advanced* developer, its still somewhat impressive for me. The project is open source, meaning you can explore it yourself [here](https://github.com/gjoedev/Demolay-Event-Bot/), and you can reuse or refactor my code to make any adjustments you feel meets your chapters needs best. 

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=gjoedev&repo=Demolay-Event-Bot&theme=dark)](https://github.com/gjoedev/Demolay-Event-Bot)

### Downloads
Just want the downloads without looking through the source code? Thats fine, these links should be able to help:
* [Windows Download](./downloads/Demolay-Event-Bot-Windows.zip)
* [Luinx Download](./downloads/Demolay-Event-Bot-Luinix.tar)
* Download with git:
    ```
    git clone https://github.com/gjoedev/Demolay-Event-Bot.git
    ```


### Setup
The full setup can be found [here](https://1drv.ms/w/s!ArXnJdAp_FG1hvRZzKuX1keBNcthzA?e=5zOn43), but if you already have a discord bot setup, simply the FirstTimeStart script to install node modules and remove .gitignore files, edit config.json with the needed values, then run the Start script, or use a command window in that directory and type:
```
node .
```
To run the bot.
<link rel="stylesheet" href="/stylesheets/index.css"/>