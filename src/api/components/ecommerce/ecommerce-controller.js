const ecommerceService = require('./ecommerce-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle input Item request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function inputItem(request, response, next) {
  try {
    const name = request.body.name;
    const description = request.body.description;
    const quantity = request.body.quantity;
    const price = request.body.price;

    const success = await ecommerceService.inputItem(
      name,
      description,
      quantity,
      price
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to input item'
      );
    }

    return response.status(200).json({ name, description, quantity, price });
  } catch (error) {
    return next(error);
  }
}
/**
 * Handle view list of items detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function viewItems(request, response, next) {
  try {
    const { page_number = 1, page_size = 10, search, sort } = request.query;
    const items = await ecommerceService.viewItems({
      page_number,
      page_size,
      search,
      sort,
    });
    return response.status(200).json(items);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteItem(request, response, next) {
  try {
    const id = request.params.id;

    const success = await ecommerceService.deleteItem(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete item'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}
/**
 * Handle update item request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateItem(request, response, next) {
  try {
    const id = request.params.id;
    const quantity = request.body.quantity;
    const price = request.body.price;

    const success = await ecommerceService.updateItem(id, quantity, price);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update item'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  inputItem,
  viewItems,
  deleteItem,
  updateItem,
};
