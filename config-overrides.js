const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

// Convert environment variables to a format webpack can use
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = function override(config, env) {
  // Add the DefinePlugin to inject environment variables
  config.plugins.push(
    new webpack.DefinePlugin(envKeys)
  );
  
  return config;
}; 