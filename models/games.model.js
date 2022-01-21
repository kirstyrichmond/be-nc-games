const db = require("../db/connection.js");

exports.selectCategories = async () => {
  try {
    const response = await db.query(`SELECT * FROM categories;`);

    return response.rows;
  } catch (err) {
    console.log(err);
  }
};

exports.selectReviewById = async (review_id) => {
  const reviewQuery = await db.query(
    `SELECT reviews.*, COUNT(comments.review_id)::INT
      AS comment_count
      FROM reviews
      JOIN comments
      ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
    [review_id]
  );

  return reviewQuery.rows[0];
};

exports.updateReviewByVote = async (review_id, updateVote) => {
    const updateVoteQuery = await db.query
    (`UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *;`,
      [updateVote, review_id])

      return updateVoteQuery.rows[0]


//   const readPromise = db.query(
//     `SELECT * FROM reviews
//     WHERE review_id = $1;`,
//     [review_id]
//   );

//   const resolvedPromise = await Promise.resolve(readPromise);
//   console.log(resolvedPromise.rows[0])

//   const oldVotes = resolvedPromise.rows[0].votes;
//   const newVotes = oldVotes + inc_votes;

// //   console.log(newVotes);
//   const updatePromise = db.query(
//     `UPDATE reviews
//       SET votes = $1
//       WHERE review_id = $2
//       RETURNING *;`,
//     [newVotes, review_id]
//   );

//   const updatedPromise = await Promise.resolve(updatePromise);

//   return updatedPromise.rows[0];
};
