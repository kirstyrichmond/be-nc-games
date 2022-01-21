\c nc_games_test

-- SELECT categories.slug, categories.description, reviews.review_id, reviews.title, comments.review_id, users.name, users.username FROM categories
-- JOIN reviews
-- ON categories.slug = reviews.category
-- JOIN comments
-- ON reviews.review_id = comments.review_id
-- JOIN users
-- ON comments.author = users.username;

-- SELECT * FROM categories;
SELECT * FROM reviews;

-- SELECT reviews.*, COUNT(comments.review_id)::INT
--       AS comment_count
--       FROM reviews
--       JOIN comments
--       ON comments.review_id = reviews.review_id
--       WHERE reviews.review_id = reviews.review_id
--       GROUP BY reviews.review_id;


-- SELECT * FROM users;

-- SELECT review_id, title, category FROM reviews;


-- SELECT * FROM comments;