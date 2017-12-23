const dotenv = require('dotenv');
const path = require('path');
const Redis = require('ioredis');
const Discord = require('discord.js');
const requireIndex = require('requireindex');

async function main() {
  dotenv.config(); // Load environment variables

  // Ensure environment variables are present
  if((process.env.REDIS_PORT || process.env.REDIS_HOST) == null) {
    console.log('Ensure you have set REDIS_PORT and REDIS_HOST');
    process.exit(-1);
  }

  if(process.env.DISCORD_TOKEN == null) {
    console.log('Ensure you have set DISCORD_TOKEN');
    process.exit(-1);
  }

  // Create Redis and Discord client
  const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);
  const client = new Discord.Client();

  // Register all modules
  const modules = requireIndex(path.join(__dirname, 'modules'));
  const context = { };

  Object.keys(modules)
        .filter(name => modules[name] != undefined)
        .forEach(name => modules[name](client, redis, context));

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setGame(`${require('../package.json').version}`);

    const guild = client.guilds.get(process.env.OPTIONS_GUILD_ID);

    context.adminRoleId = guild.roles.find('name', 'Administrators').id;
    // context.moderatorRoleId = guild.roles.find('name', 'Moderators').id;
    context.restrictedRoleId = guild.roles.find('name', 'Restricted').id;
  });

  // Login; ensure that you've set DISCORD_TOKEN in .env
  client.login(process.env.DISCORD_TOKEN);
}

main().then(_ => { }).catch(error => console.error(error));
