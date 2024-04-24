const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @param
 * @param {string} search - Search options
 * @returns {Array}
 */
async function getUsers({ page_number, page_size, search, sort }) {
  let query = {};

  let users = await usersRepository.getUsers();

  // make the search function
  if (search) {
    const [searchField, searchKey] = search.split(':');
    query[searchField] = { $regex: new RegExp(searchKey, 'i') };
  }

  // Apply sorting function
  let sortOptions = {};
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
  }

  if (Object.keys(sortOptions).length !== 0) {
    const sortField = Object.keys(sortOptions)[0]; // Get sortField directly
    const sortOrder = sortOptions[sortField] === 1 ? 'asc' : 'desc';

    users.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }

  //count all the users
  const count = users.length;

  //calculate total pages
  const total_pages = Math.ceil(count / page_size);

  //Check if there is a previous page
  const has_previous_page = page_number > 1;

  //Check if there is a next page
  const has_next_page = page_number < total_pages;

  //apply the pagination
  users = users.slice((page_number - 1) * page_size, page_number * page_size);

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
    count: data.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
