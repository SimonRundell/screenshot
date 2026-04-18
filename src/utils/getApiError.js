/**
 * Returns a readable error message from axios/network errors.
 * @param {any} error
 * @param {string} fallback
 * @returns {string}
 */
export default function getApiError(error, fallback = 'Something went wrong') {
  return error?.response?.data?.error || error?.message || fallback;
}
