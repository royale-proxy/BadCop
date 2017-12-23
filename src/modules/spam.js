module.exports = function(client) {
  client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('Pong!');
    }
  });
}
