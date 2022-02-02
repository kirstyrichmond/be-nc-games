const db = require("../db/connection.js");

exports.updateCommentVote = async (comment_id, inc_votes) => {
  const comment = await db.query(
    `UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`,
    [inc_votes, comment_id]
  );

  return comment.rows[0];
};

exports.removeComment = async (comment_id) => {
  const comment = await db.query(
    `DELETE FROM comments
      WHERE comment_id = $1;`,
    [comment_id]
  );

  return comment.rows[0];
};
