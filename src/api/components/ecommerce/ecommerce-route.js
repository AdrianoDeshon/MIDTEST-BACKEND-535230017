const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const ecommerceControllers = require('./ecommerce-controller');
const ecommerceValidator = require('./ecommerce-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/ecommerce', route);

  //CREATE
  //Input items that you sell
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(ecommerceValidator.inputItem),
    ecommerceControllers.inputItem
  );
  //READ
  //Get list of items that you sell
  route.get('/', authenticationMiddleware, ecommerceControllers.viewItems);

  //DELETE
  //Delete items from your ecommerce
  route.delete(
    '/:id',
    authenticationMiddleware,
    ecommerceControllers.deleteItem
  );

  //UPDATE
  //Update Quantity or Price of the item
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(ecommerceValidator.updateItem),
    ecommerceControllers.updateItem
  );
};
