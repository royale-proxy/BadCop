module.exports = function(client, redis, context) {
  client.on('normal', message => {
    // Ignore if it's a bot, DM, or admin
    if (
      message.author.bot ||
      !message.guild ||
      !message.member ||
      !message.guild.member(client.user).hasPermission("BAN_MEMBERS") ||
      message.member.hasPermission("MANAGE_MESSAGES")
    ) return;

    
  });
}
