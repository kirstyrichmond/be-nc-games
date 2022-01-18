const { selectCategories, selectReviewById } = require("../models/games.model");

const { checkReviewExists } = require("../utils/utils");

exports.getCategories = (req, res) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  return checkReviewExists(review_id)
    .then((reviewExists) => {
      if (!reviewExists) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      } else {
        return selectReviewById(review_id);
      }
    })
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
