const amqp = require('amqplib')
const cfg = require('./../lib/env-vars.js');
const logger = require('./../utils/logger')


const createClient = () => amqp.connect(`amqp://${cfg.RABBIT_USER}:${cfg.RABBIT_PASS}@${cfg.RABBIT_HOST}:${cfg.RABBIT_PORT}/${cfg.RABBIT_VHOST}`)
  .then(conn => conn.createChannel())
  .then(channel => {
    channel.assertExchange(cfg.RABBIT_LOGIN_X, "direct", { durable: true });
    channel.assertQueue(cfg.RABBIT_LOGIN_Q, { durable: true });
    channel.bindQueue(cfg.RABBIT_LOGIN_Q, cfg.RABBIT_LOGIN_X);
    logger.info(`[RabittMQ]: ${cfg.RABBIT_LOGIN_X} exchange is bound to ${cfg.RABBIT_LOGIN_Q} queue and is ready to publish`)

    channel.assertExchange(cfg.RABBIT_REGISTER_X, "direct", { durable: true });
    channel.assertQueue(cfg.RABBIT_REGISTER_Q, { durable: true });
    channel.assertQueue(cfg.RABBIT_REGISTER_M_Q, { durable: true });
    channel.bindQueue(cfg.RABBIT_REGISTER_Q, cfg.RABBIT_REGISTER_X);
    channel.bindQueue(cfg.RABBIT_REGISTER_M_Q, cfg.RABBIT_REGISTER_X, 'registerMatchToUser');
    logger.info(`[RabittMQ]: ${cfg.RABBIT_REGISTER_X} exchange is bound to ${cfg.RABBIT_REGISTER_Q} queue and is ready to publish`)
    logger.info(`[RabittMQ]: ${cfg.RABBIT_REGISTER_X} exchange is bound to ${cfg.RABBIT_REGISTER_M_Q} queue and is ready to publish`)

    channel.assertExchange(cfg.RABBIT_DELETE_X, "direct", { durable: true });
    channel.assertQueue(cfg.RABBIT_DELETE_U_Q, { durable: true });
    channel.bindQueue(cfg.RABBIT_DELETE_U_Q, cfg.RABBIT_DELETE_X, 'deleteUser');
    channel.assertQueue(cfg.RABBIT_DELETE_M_Q, { durable: true });
    channel.bindQueue(cfg.RABBIT_DELETE_M_Q, cfg.RABBIT_DELETE_X, 'deleteMatch');
    logger.info(`[RabittMQ]: ${cfg.RABBIT_DELETE_X} exchange is bound to ${cfg.RABBIT_DELETE_U_Q} & ${cfg.RABBIT_DELETE_M_Q} queue and is ready to publish`)
    
    return channel;
  });

  module.exports.createClient = createClient;