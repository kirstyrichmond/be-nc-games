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
  const sqlQuery = db.query(
    `SELECT * FROM reviews 
       WHERE review_id = $1;`,
    [review_id]
  );

  const commentCount = db.query(
    `SELECT COUNT(*)::INT AS comment_count
      FROM comments
      WHERE review_id = $1
      GROUP BY review_id;`,
    [review_id]
  );

  const [sqlResponse, commentResponse] = await Promise.all([
    sqlQuery,
    commentCount,
  ]);

  const combinedObjects = {
    ...sqlResponse.rows[0],
    ...commentResponse.rows[0],
  };
  return combinedObjects;
};
