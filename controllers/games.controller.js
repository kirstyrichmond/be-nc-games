const {
  selectCategories,
  selectReviewById,
  updateReviewByVote,
} = require("../models/games.model");

const { checkReviewExists } = require("../utils/utils");

exports.getCategories = async (req, res, next) => {
  try {
    const categoriesData = await selectCategories();
    res.status(200).send({ categories: categoriesData });
  } catch (err) {
    next(err);
  }
};

exports.getReviewById = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const checkReviewById = await selectReviewById(review_id);
    if (checkReviewById) {
      res.status(200).send({ review: checkReviewById });
    } else {
      await Promise.reject({ status: 404, msg: "Not found!" });
    }
  } catch (err) {
    next(err);
  }
};

exports.patchReviewByVote = async (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const updateVoteQuery = await updateReviewByVote(review_id, inc_votes);
    if (updateVoteQuery) {
      res.status(201).send({ review: updateVoteQuery });
    } else {
      await Promise.reject({
        status: 404,
        msg: "That review_id does not exist!",
      });
    }
  } catch (err) {
    next(err);
  }
};
