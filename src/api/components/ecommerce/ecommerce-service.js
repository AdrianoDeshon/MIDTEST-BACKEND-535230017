const ecommerceRepository = require('./ecommerce-repository');

/**
 * Input new item
 * @param {string} name - Name of the item
 * @param {string} description - Description of the item
 * @param {number} quantity - Quantity of the item
 * @param {number} price - Price of the item
 * @returns {boolean}
 */
async function inputItem(name, description, quantity, price) {
  try {
    await ecommerceRepository.inputItem(name, description, quantity, price);
  } catch (err) {
    return null;
  }

  return true;
}
/**
 * Get list of items with pagination and filter
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} search - Search options
 * @param {string} sort - Sort options
 * @returns {Array}
 */
async function viewItems({ page_number, page_size, search, sort }) {
  let query = {};
  let sortOptions = {};

  // Make the search function
  if (search) {
    const [searchField, searchKey] = search.split(':');
    query[searchField] = { $regex: new RegExp(searchKey, 'i') };
  }

  // Apply sorting function
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
  }

  return await ecommerceRepository.viewItems({
    page_number,
    page_size,
    query,
    sortOptions,
  });
}

/**
 * Delete items
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteItem(id) {
  const item = await ecommerceRepository.getItem(id);

  // User not found
  if (!item) {
    return null;
  }

  try {
    await ecommerceRepository.deleteItem(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing item
 * @param {string} id - Item ID
 * @param {number} quantity - Quantity of the item
 * @param {number} price - Price of the item
 * @returns {boolean}
 */
async function updateItem(id, quantity, price) {
  const item = await ecommerceRepository.getItem(id);

  // User not found
  if (!item) {
    return null;
  }

  try {
    await ecommerceRepository.updateItem(id, quantity, price);
  } catch (err) {
    return null;
  }

  return true;
}
module.exports = {
  inputItem,
  viewItems,
  deleteItem,
  updateItem,
};
