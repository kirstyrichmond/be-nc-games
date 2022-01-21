const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  // 2. insert data
  return (
    db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS reviews;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS categories;`);
      })
      .then(() => {
        return db.query(`
      CREATE TABLE categories (
        slug VARCHAR(50) NOT NULL PRIMARY KEY,
        description VARCHAR(600) NOT NULL
        );
      `);
      })
      .then(() => {
        return db.query(`
      CREATE TABLE users (
        username VARCHAR(25) PRIMARY KEY,
        name VARCHAR(55) NOT NULL,
        avatar_url VARCHAR(300)
      )
      `);
      })
      .then(() => {
        return db.query(`
      CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(75) NOT NULL,
        designer VARCHAR(55),
        owner VARCHAR(55) NOT NULL REFERENCES users(username),
        review_img_url VARCHAR(175) DEFAULT 
            'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        review_body VARCHAR(1000) NOT NULL,
        category VARCHAR(75) NOT NULL REFERENCES categories(slug),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0
        );
      `);
      })
      .then(() => {
        return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR(1000) NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(75) NOT NULL REFERENCES users(username),
        review_id INT NOT NULL REFERENCES reviews(review_id),
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `);
      })
      .then(() => {
        const formattedCategories = categoryData.map((category) => {
          const { slug, description } = category;

          return [slug, description];
        });
        const sql = format(
          `INSERT INTO categories
      (slug, description)
      VALUES
      %L RETURNING *;`,
          formattedCategories
        );
        return db.query(sql);
      })
      // .then((result) => {
      //   const categoryRows = result.rows;

      //   const createCategroyRef = (categoryRows) => {
      //     const ref = {};

      //     categoryRows.forEach((category) => {
      //       ref[category.slug] = category.id;
      //     });
      //     return ref;
      //   };
      //   console.log(createCategroyRef(categoryRows))
      // })
      .then(() => {
        const formattedUsers = userData.map((user) => {
          const { username, name, avatar_url } = user;
          return [username, name, avatar_url];
        });
        const sql = format(
          `
          INSERT INTO users
          (username, name, avatar_url)
          VALUES
          %L RETURNING *;
          `,
          formattedUsers
        );
        return db.query(sql);
      })
      .then(() => {
        const formattedReviews = reviewData.map((review) => {
          const {
            title,
            category,
            owner,
            review_body,
            designer,
            review_img_url,
            votes,
            created_at,
          } = review;
          return [
            title,
            category,
            owner,
            review_body,
            designer,
            review_img_url,
            votes,
            created_at,
          ];
        });
        // console.log(formattedReviews);
        const sql = format(
          `
          INSERT INTO reviews
          (title, category, owner, review_body, designer, review_img_url, votes, created_at)
          VALUES
          %L RETURNING *;
          `,
          formattedReviews
        );
        return db.query(sql);
      })
      .then(() => {
        const formattedComments = commentData.map((comment) => {
          const { author, review_id, body, votes, created_at } = comment;
          return [author, review_id, body, votes, created_at];
        });
        // console.log(formattedComments);
        const sql = format(
          `
      INSERT INTO comments
      (author, review_id, body, votes, created_at)
      VALUES
      %L RETURNING *;
      `,
          formattedComments
        );
        return db.query(sql);
      })
      .catch((err) => {
        console.log(err);
      })
  );
};

module.exports = seed;
