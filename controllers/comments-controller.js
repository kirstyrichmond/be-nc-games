const {
  removeComment,
  updateCommentVote,
} = require("../models/comments-models");
const { checkCommentExists } = require("../utils/check-exists-utils");

exports.patchCommentVote = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const comment = await updateCommentVote(comment_id, inc_votes);

    if (comment && Object.keys(req.body).length > 0) {
      res.status(201).send({ comment });
    } else if (comment) {
      res.status(400).send({ msg: "Bad request!" });
    } else {
      res.status(404).send({ msg: "Not found!" });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    const commentExists = await checkCommentExists(comment_id);
    if (commentExists) {
      const comment = await removeComment(comment_id);
      res.status(204).send({ comment });
    } else {
      await Promise.reject({ status: 404, msg: "Not found!" });
    }
  } catch (err) {
    next(err);
  }
};
