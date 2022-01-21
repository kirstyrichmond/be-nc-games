const db = require("../db/connection.js");

exports.selectReviewById = async (review_id) => {
  const review = await db.query(
    `SELECT reviews.*, COUNT(comments.review_id)::INT
      AS comment_count
      FROM reviews
      JOIN comments
      ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
    [review_id]
  );
  return review.rows[0];
};

exports.updateReviewByVote = async (review_id, updateVote) => {
  const reviewVote = await db.query(
    `UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *;`,
    [updateVote, review_id]
  );

  return reviewVote.rows[0];
};

exports.selectReviews = async (
  sortBy = "created_at",
  orderBy = "desc",
  category
) => {
  const validOrderBy = ["asc", "desc"];

  const validSortBy = [
    "review_id",
    "title",
    "designer",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];

  if (!validOrderBy.includes(orderBy) || !validSortBy.includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request!",
    });
  }

  let categoryFilter = ``;
  if (category) {
    categoryFilter = `WHERE reviews.category = '${category}'`;
  }

  let review = `SELECT reviews.review_id, reviews.title, reviews.owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id)::INT
        AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        ${categoryFilter}
        GROUP BY reviews.review_id
        ORDER BY ${sortBy} ${orderBy};`;
  const reviewResolved = await db.query(review);

  return reviewResolved.rows;
};

exports.selectCommentsByReview = async (review_id) => {
  const comments = await db.query(
    `SELECT * FROM comments
      WHERE comments.review_id = $1;`,
    [review_id]
  );
  return comments.rows;
};

exports.addComment = async (review_id, username, body) => {
  const comment = await db.query(
    `INSERT INTO comments
        (author, review_id, body)
        VALUES 
        ($1, $2, $3)
        RETURNING *;`,
    [username, review_id, body]
  );
  return comment.rows[0];
};