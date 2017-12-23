module.exports = function(client, redis, context) {
  client.on('message', message => {
    if(message.content.startsWith('!')) {
      const raw = message.content.substr(1);
      const args = raw.split(' ');

      const hasDestructivePriveleges = message.member.roles.has(context.adminRoleId) || message.member.roles.has(context.moderatorRoleId);

      // If they're restricted, ignore
      if(message.member.roles.has(context.restrictedRoleId)) {
        message.delete();
        return;
      }

      client.emit('command', { hasDestructivePriveleges, raw, args, message });
    } else {
      client.emit('normal', message);
    }
  });

  client.on('command', ({ hasDestructivePriveleges, raw, args, message }) => {
    switch(args[0]) {
      case 'ping':
        message.channel.send('Pong');
        break;
      case 'help':
        message.channel.send(`Ha, you'd think I would add a help feature?`);
        break;
      case 'version':
        message.channel.send(require('../../package.json').version);
        break;
      case 'whoami':
        let { channel } = message;
        if(hasDestructivePriveleges) {
          channel.send('Above the law');
        } else {
          channel.send('Regular');
        }
        break;
      default:
        message.channel.send('Not a command');
        message.delete();
        break;
      }
  });
}
