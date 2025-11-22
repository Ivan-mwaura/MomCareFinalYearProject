const Mother = require('../models/Mother');

exports.registerMother = async (data) => {
  return await Mother.create(data);
};

exports.getAllMothers = async () => {
  return await Mother.findAll();
};
