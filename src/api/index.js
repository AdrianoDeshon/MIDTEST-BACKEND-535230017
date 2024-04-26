const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const ecommerce = require('./components/ecommerce/ecommerce-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  ecommerce(app);

  return app;
};
