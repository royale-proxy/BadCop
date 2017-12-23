module.exports = function(client, redis, context) {
  client.on('normal', async (message) => {
    // Ignore if it's a bot, DM, or admin
    if (
      message.author.bot ||
      !message.guild ||
      !message.member ||
      !message.guild.member(client.user).hasPermission("BAN_MEMBERS") ||
      message.member.hasPermission("MANAGE_MESSAGES")
    ) return;

    let messages = await redis.get(`spam:${message.author.id}`);
    if(messages == null) {
      await redis.set(`spam:${message.author.id}`, 0, 'ex', parseInt(process.env.OPTIONS_SPAM_RATE_LIMIT));
      messages = parseInt(await redis.get(`spam:${message.author.id}`));
    }

    await redis.set(`spam:${message.author.id}`, ++messages);

    if(messages == 5) {
      message.channel.send(message.author.toString() + ` slow it down there, bucko`);
    }

    if(messages == 10) {
      message.channel.send(`Goodbye ` + message.author.toString());
      const kickMember = message.guild.member(message.author);
      message.guild.member(kickMember).kick();
      context.log('I just kicked ' + message.author.toString());
    }
  });
}
