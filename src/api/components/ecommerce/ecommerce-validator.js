const joi = require('joi');
const { quantity } = require('../../../models/items-schema');

module.exports = {
  inputItem: {
    body: {
      name: joi.string().required().label('Name'),
      description: joi.string().required().label('Description'),
      quantity: joi.number().required().label('Quantity'),
      price: joi.number().required().label('Price'),
    },
  },
  updateItem: {
    body: {
      quantity: joi.number().required().label('Quantity'),
      price: joi.number().required().label('Price'),
    },
  },
};
