const commentsRouter = require("express").Router();
const {
  patchCommentVote,
  deleteComment,
} = require("../controllers/comments-controller");

commentsRouter.patch("/:comment_id", patchCommentVote);
commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
