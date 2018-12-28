const translate = require('../translate');
require('colors');

const replace = (msg, values = {}) => Object.entries(values).reduce((prev, [key, value]) => {
  const regex = new RegExp(`{${key}}`, 'g');
  return prev.replace(regex, value);
}, translate[msg] || msg);

class Logger {
  static warn(msg, values) {
    console.log(replace(msg, values).orange);
  }

  static info(msg, values) {
    console.log(replace(msg, values).yellow);
  }

  static success(msg, values) {
    console.log(replace(msg, values).green);
  }

  static error(msg, values) {
    console.log(replace(msg, values).red);
  }

  static translate(msg, values) {
    return replace(msg, values);
  }
}

module.exports = Logger;
