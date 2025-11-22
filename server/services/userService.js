const User = require('../models/User');

exports.findUserById = async (id) => {
  return await User.findByPk(id);
};

exports.updateUserProfile = async (id, data) => {
  await User.update(data, { where: { id } });
  return await User.findByPk(id);
};
