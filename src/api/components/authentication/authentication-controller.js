const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const failedLoginAttempts = {}; // Store failed login attempt for each user
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if the user has exceeded the maximum failed login attempts
    if (failedLoginAttempts[email] >= 5) {
      throw errorResponder(
        errorTypes.TOO_MANY_ATTEMPTS,
        'Too many login attempts. Please try again after 30 minutes.'
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increment failed login attempts for the user
      failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;

      // If the user reaches 5 failed attempts, apply the cooldown
      if (failedLoginAttempts[email] >= 5) {
        setTimeout(
          () => {
            // Remove user from failed login attempts after cooldown
            delete failedLoginAttempts[email];
          },
          30 * 60 * 1000
        );
      }

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password. Please try again.'
      );
    }

    // Reset failed login attempts after successfully login
    delete failedLoginAttempts[email];

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
