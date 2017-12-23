module.exports = function(client, redis, context) {
  context = {
    log: function(message) {
      client.channels.get(process.env.OPTIONS_LOG_CHANNEL).send({ embed: message });
    }
  };
}
