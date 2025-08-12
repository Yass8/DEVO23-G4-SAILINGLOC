
/* * @file sanitize.js
 * @description Utility functions to sanitize user data.
 */
export const sanitizeUser= (user) => {
  if (!user) return null;
  const { password, createdAt, updatedAt, ...rest } = user.toJSON();
  return rest;
};