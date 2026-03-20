/* eslint-disable camelcase */
// eslint-disable-next-line import/prefer-default-export
export const ReturnAllowedData = (employeeUpdated) => {
  const {
    password_hash, adminpassword_hash, permission, address_allowed, boss, ...allowedData
  } = employeeUpdated;

  return allowedData;
};
