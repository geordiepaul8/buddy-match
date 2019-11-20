require('dotenv').config();

/* server connection details */
const APP_PORT = process.env.APP_PORT || 3001;
const SET_AUTH = process.env.SET_AUTH || 'false';
const USE_TLS = process.env.USE_TLS || null;

/* mongo connection details */
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_DB = process.env.MONGO_DB || 'MyDb';

/* redis connection details */
const REDIS_PORT   = process.env.REDIS_PORT || 6379;
const REDIS_HOST   = process.env.REDIS_HOST || 'localhost';
const REDIS_EXPIRY = process.env.REDIS_EXPIRY || 3600; // default 1hr expiry

/* rabbit mq connection details */

const RABBIT_USER = process.env.RABBIT_USER || 'user';
const RABBIT_PASS = process.env.RABBIT_PASS || 'user';
const RABBIT_HOST = process.env.RABBIT_HOST || 'localhost';
const RABBIT_VHOST = process.env.RABBIT_VHOST || 'vhost';
const RABBIT_PORT = process.env.RABBIT_PORT || 5672;
const RABBIT_LOGIN_X = process.env.RABBIT_LOGIN_X || 'LoginExchange';
const RABBIT_LOGIN_Q = process.env.RABBIT_LOGIN_Q || 'LoginQ';
const RABBIT_REGISTER_X = process.env.RABBIT_REGISTER_X || 'RegisterExchange';
const RABBIT_REGISTER_Q = process.env.RABBIT_REGISTER_Q || 'RegisterQ';
const RABBIT_REGISTER_M_Q = process.env.REGISTER_DELETE_M_Q || 'RegisterMatchesQ';
const RABBIT_DELETE_X = process.env.RABBIT_DELETE_X || 'DeleteExchange';
const RABBIT_DELETE_U_Q = process.env.RABBIT_DELETE_U_Q || 'DeleteUserQ';
const RABBIT_DELETE_M_Q = process.env.RABBIT_DELETE_M_Q || 'DeleteMatchesQ';

module.exports = {
  APP_PORT,
  SET_AUTH,
  USE_TLS,
  MONGO_PORT,
  MONGO_HOST,
  MONGO_DB,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_EXPIRY,
  RABBIT_USER,
  RABBIT_PASS,
  RABBIT_HOST,
  RABBIT_VHOST,
  RABBIT_PORT,
  RABBIT_LOGIN_X,
  RABBIT_LOGIN_Q,
  RABBIT_REGISTER_X,
  RABBIT_REGISTER_Q,
  RABBIT_REGISTER_M_Q,
  RABBIT_DELETE_X,
  RABBIT_DELETE_U_Q,
  RABBIT_DELETE_M_Q
};