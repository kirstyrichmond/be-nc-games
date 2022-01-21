const { selectCategories } = require("../models/categories-models");

exports.getCategories = async (req, res, next) => {
  try {
    const categoriesData = await selectCategories();
    res.status(200).send({ categories: categoriesData });
  } catch (err) {
    next(err);
  }
};
