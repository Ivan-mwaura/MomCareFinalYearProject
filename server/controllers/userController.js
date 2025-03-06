const { User } = require('../models');

exports.getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  await User.update({ firstName, lastName, email }, { where: { id: req.user.id } });
  const updatedUser = await User.findByPk(req.user.id);
  res.json({ user: updatedUser });
};
