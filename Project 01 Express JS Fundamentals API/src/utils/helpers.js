// Simple helper functions
const formatResponse = (success, data, message = '') => {
  return { success, data, message };
};

export { formatResponse };