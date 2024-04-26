const { Item } = require('../../../models');
const { description } = require('../../../models/items-schema');

/**
 * Create new user
 * @param {string} name - Name of the item
 * @param {string} description - Description of the item
 * @param {number} quantity - Quantity of the item
 * @param {number} price - Price of the item
 * @returns {Promise}
 */
async function inputItem(name, description, quantity, price) {
  return Item.create({
    name,
    description,
    quantity,
    price,
  });
}

/**
 * Get a list of users with pagination and filter
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} query - Query
 * @param {string} sortOptions - Sort Options
 * @returns {Promise}
 */
async function viewItems({ page_number, page_size, query, sortOptions }) {
  let itemsQuery = Item.find(query);

  // Apply sorting
  if (sortOptions && Object.keys(sortOptions).length !== 0) {
    itemsQuery = itemsQuery.sort(sortOptions);
  }

  // Get total count of items
  const count = await Item.countDocuments(query);

  // Calculate total pages
  const total_pages = Math.ceil(count / page_size);

  // Check if there is a previous page
  const has_previous_page = page_number > 1;

  // Check if there is a next page
  const has_next_page = page_number < total_pages;

  // Apply pagination
  const items = await itemsQuery
    .skip((page_number - 1) * page_size)
    .limit(page_size)
    .lean();

  const data = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    data.push({
      id: item._id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    });
  }
  return {
    page_number: parseInt(page_number),
    page_size: parseInt(page_size),
    count: items.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data,
  };
}
/**
 * Get item detail
 * @param {string} id - Item ID
 * @returns {Promise}
 */
async function getItem(id) {
  return Item.findById(id);
}

/**
 * Delete an item
 * @param {string} id - Item ID
 * @returns {Promise}
 */
async function deleteItem(id) {
  return Item.deleteOne({ _id: id });
}

/**
 * Update existing item
 * @param {string} id - Item ID
 * @param {string} quantity - Quantity of the item
 * @param {string} price - Price of the item
 * @returns {Promise}
 */
async function updateItem(id, quantity, price) {
  return Item.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        quantity,
        price,
      },
    }
  );
}
module.exports = {
  inputItem,
  viewItems,
  getItem,
  deleteItem,
  updateItem,
};
