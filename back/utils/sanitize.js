
/* * @file sanitize.js
 * @description Utility functions to sanitize user data.
 */
export const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, created_at, updated_at, ...rest } = user.toJSON();
  return rest;
};