const reviewsRouter = require("express").Router();

const {
  getReviews,
  getReviewById,
  getCommentsByReview,
  patchReviewByVote,
  postComment,
  postReview,
  deleteReview,
} = require("../controllers/reviews-controller");

reviewsRouter.get("/", getReviews);

reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.patch("/:review_id", patchReviewByVote);
reviewsRouter.post("/:review_id", postReview);
reviewsRouter.delete("/:review_id", deleteReview);

reviewsRouter.get("/:review_id/comments", getCommentsByReview);
reviewsRouter.post("/:review_id/comments", postComment);

module.exports = reviewsRouter;
