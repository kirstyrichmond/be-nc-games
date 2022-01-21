const { push } = require("../db/data/test-data/reviews");
const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReview,
  updateReviewByVote,
  addComment,
  removeComment,
} = require("../models/games.model");

const {
  checkReviewExists,
  checkUserExists,
  checkCommentExists,
} = require("../utils/utils");

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

exports.getReviews = async (req, res, next) => {
  const { sort_by, order, category } = req.query;
  try {
    const reviewsData = await selectReviews(sort_by, order, category);
    if (reviewsData) {
      res.status(200).send({ reviews: reviewsData });
    } else {
      await Promise.reject({
        status: 404,
        msg: "Not found!",
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByReview = async (req, res, next) => {
  //   console.log(req.params);
  const { review_id } = req.params;
  try {
    const commentData = await selectCommentsByReview(review_id);
    // console.log(commentData);
    if (commentData) {
      res.status(200).send({ comments: commentData });
    } else {
      await Promise.reject({
        status: 404,
        msg: "Not found!",
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  //   console.log(body);
  try {
    const reviewExists = await checkReviewExists(review_id);
    const userExists = await checkUserExists(username);
    if (!reviewExists || !userExists) {
      await Promise.reject({ status: 404, msg: "Not found!" });
    } else if (!body.length) {
      await Promise.reject({ status: 400, msg: "Bad request!" });
    } else {
      const comment = await addComment(review_id, username, body);
      res.status(201).send({ comment });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    const commentExists = await checkCommentExists(comment_id);
    // console.log(commentExists);

    if (!commentExists) {
      await Promise.reject({ status: 404, msg: "Not found!" });
    } else {
      const comment = await removeComment(comment_id);
      res.status(204).send({ comment });
    }
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  console.log("inside controller...");
};
