const { User } = require('../../../models');

/**
 * Get a list of users with pagination and filter
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} query - Query
 * @param {string} sortOptions - Sort Options
 * @returns {Promise}
 */
async function getUsers({ page_number, page_size, query, sortOptions }) {
  let usersQuery = User.find(query);

  // Apply sorting
  if (sortOptions && Object.keys(sortOptions).length !== 0) {
    usersQuery = usersQuery.sort(sortOptions);
  }

  // Get total count of users
  const count = await User.countDocuments(query);

  // Calculate total pages
  const total_pages = Math.ceil(count / page_size);

  // Check if there is a previous page
  const has_previous_page = page_number > 1;

  // Check if there is a next page
  const has_next_page = page_number < total_pages;

  // Apply pagination
  const users = await usersQuery
    .skip((page_number - 1) * page_size)
    .limit(page_size)
    .lean();

  const data = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    data.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
  return {
    page_number: parseInt(page_number),
    page_size: parseInt(page_size),
    count: users.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
