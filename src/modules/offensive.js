const wordfilter = require('wordfilter');

module.exports = function(client, redis, context) {
  client.on('normal', async (message) => {
    if(wordfilter.blacklisted(message.content)) {
      if(message.member.roles.has(context.adminRoleId) || message.member.roles.has(context.moderatorRoleId)) {
        return;
      }

      let warnings = await redis.get(`warnings:${message.author.id}`);

      if(warnings == null) {
        await redis.set(`warnings:${message.author.id}`, 0);
        warnings = await redis.get(`warnings:${message.author.id}`);
      }

      ++warnings

      if(warnings >= 3) {
        message.channel.send(message.author.toString() + `, 3 strikes, you're out!`);
        const kickMember = message.guild.member(message.author);
        message.guild.member(kickMember).kick();
        context.log('I just kicked ' + message.author.toString());
        await redis.set(`warnings:${message.author.id}`, 0);
      } else {
        message.channel.send(message.author.toString() + `, and... that's a warning for you (${warnings}/${process.env.OPTIONS_MAX_WARNINGS})`);
        await redis.set(`warnings:${message.author.id}`, warnings);
      }
    }
  });
}
