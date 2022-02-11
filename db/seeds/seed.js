const db = require("../connection");
const format = require("pg-format");
const {
  formatCategories,
  formatUsers,
  formatReviews,
  formatComments,
} = require("../../utils/seed-utils");

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  await db.query(`DROP TABLE IF EXISTS comments, reviews, users, categories;`);

  // Create Categories Table //

  await db.query(`
      CREATE TABLE categories (
        slug VARCHAR(50) PRIMARY KEY,
        description VARCHAR(600) NOT NULL
        );
      `);

  // Create Users Table //

  await db.query(`
      CREATE TABLE users (
        username VARCHAR(25) NOT NULL PRIMARY KEY,
        name VARCHAR(55) NOT NULL,
        avatar_url VARCHAR(300)
      )
      `);

  // Create Reviews Table //

  await db.query(`
      CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(75) NOT NULL,
        designer VARCHAR(55) NOT NULL,
        owner VARCHAR(180) REFERENCES users(username),
        review_img_url VARCHAR(500) DEFAULT 
            'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        review_body VARCHAR(1000) NOT NULL,
        category VARCHAR(75) REFERENCES categories(slug),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0
        );
      `);

  // Create Comments Table //

  await db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR(1000) NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(75) REFERENCES users(username) NOT NULL,
        review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `);

  // Insert into Categories Table //

  const formattedCategories = formatCategories(categoryData);

  const categoryQuery = format(
    `INSERT INTO categories
      (slug, description)
      VALUES
      %L RETURNING *;`,
    formattedCategories
  );
  await db.query(categoryQuery);

  // Insert into Users Table //

  const formattedUsers = formatUsers(userData);
  const usersQuery = format(
    `
          INSERT INTO users
          (username, name, avatar_url)
          VALUES
          %L RETURNING *;
          `,
    formattedUsers
  );
  await db.query(usersQuery);

  // Insert into Reviews Table //

  const formattedReviews = formatReviews(reviewData);
  const reviewsQuery = format(
    `
          INSERT INTO reviews
          (title, category, owner, review_body, designer, review_img_url, votes, created_at)
          VALUES
          %L RETURNING *;
          `,
    formattedReviews
  );
  await db.query(reviewsQuery);

  // Insert into Comments Table //

  const formattedComments = formatComments(commentData);

  const commentsQuery = format(
    `
      INSERT INTO comments
      (author, review_id, body, votes, created_at)
      VALUES
      %L RETURNING *;
      `,
    formattedComments
  );
  await db.query(commentsQuery);
};

module.exports = seed;
