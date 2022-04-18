const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');
const express = require('express')
const {fetchEvents} = require('./utils/eventfetcher')
const {generateCal} = require('./utils/icalgen.js')

const config = require('./config/config.json')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

/*
 * WEB SERVER
 */

const app = express()
const port = 3042

app.get('/cal/:guildID', (req, res) => {
  const guild = client.guilds.cache.get(req.params.guildID)
  if (guild) {
    fetchEvents(guild).then(events => {
      res.send(generateCal(events, guild.name))
    })
  } else {
    res.status(404).send("guild not found")
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/*
 * DISCORD BOT
 */


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // register slash commands

    const commands = [{
        name: 'events',
        description: 'Sends an iCal link to the server events'
    }]; 
    
    const rest = new REST({ version: '9' }).setToken(config.token);
    
    (async () => {
        try {
        console.log('Started refreshing application (/) commands.');
    
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
    
        console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
        console.error(error);
        }
    })();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'events') {
    await interaction.reply("Here's a link to the iCal feed: " + config.baseUrl + "/cal/" + interaction.guild.id);
  }
});

client.login(config.token);