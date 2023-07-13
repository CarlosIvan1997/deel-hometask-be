const buildCustomError = (status = 500, message = 'Something went wrong') => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

module.exports = { buildCustomError };
