const db = require("../db/connection.js");

exports.checkReviewExists = async (review_id) => {
  return db
    .query(
      `SELECT * 
        FROM reviews
        WHERE review_id = $1`,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length) {
        return true;
      } else {
        return false;
      }
    });
};
