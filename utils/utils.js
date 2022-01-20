const { rows } = require("pg/lib/defaults");
const db = require("../db/connection.js");

exports.checkReviewExists = async (review_id) => {
  const review = await db.query(
    `SELECT * 
        FROM reviews
        WHERE review_id = $1`,
    [review_id]
  );
  //   console.log(review.rows);
  if (review.rows.length) {
    return true;
  } else {
    return false;
  }
};

exports.checkUserExists = async (username) => {
  const user = await db.query(
    `SELECT * FROM users
      WHERE username = $1`,
    [username]
  );

  if (user.rows.length) {
    return true;
  } else {
    return false;
  }
};

exports.checkCommentExists = async (comment_id) => {
  const comment = await db.query(
    `SELECT * FROM comments
      WHERE comment_id = $1;`,
    [comment_id]
  );

  if (comment.rows.length) {
    return true;
  } else {
    return false;
  }
};
