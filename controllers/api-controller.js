const { selectEndpoints } = require("../models/api-model");

exports.getApi = async (req, res, next) => {
  try {
    const endpoints = await selectEndpoints();
    res.status(200).send({ endpoints });
  } catch {
    next(err);
  }
};
