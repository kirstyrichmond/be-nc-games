const {
  selectReviewById,
  updateReviewByVote,
  selectReviews,
  selectCommentsByReview,
  addComment,
} = require("../models/reviews-models");

const {
  checkReviewExists,
  checkUserExists,
} = require("../utils/check-exists-utils");

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

    if (inc_votes === undefined) {
      res.status(200).send({ review: updateVoteQuery });
    } else if (inc_votes) {
      console.log("successful...");
      res.status(201).send({ review: updateVoteQuery });
    } else if (typeof inc_votes !== "number") {
      console.log("this is a bad request");
      await Promise.reject({ status: 400, msg: "Bad request!" });
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
  const { review_id } = req.params;
  // console.log(review_id);

  try {
    const commentData = await selectCommentsByReview(review_id);

    if (commentData.length > 0) {
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

  // console.log(req.body.body.length)

  try {
    const reviewExists = await checkReviewExists(review_id);
    const userExists = await checkUserExists(username);

    if (!reviewExists || !userExists) {
      await Promise.reject({ status: 404, msg: "Not found!" });
    } else if (req.body.body.length === 0) {
      await Promise.reject({ status: 400, msg: "Bad request!" });
    } else {
      const comment = await addComment(review_id, username, body);
      res.status(201).send({ comment });
    }
  } catch (err) {
    next(err);
  }
};
