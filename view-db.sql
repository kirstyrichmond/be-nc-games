\c nc_games_test

-- SELECT categories.slug, categories.description, reviews.review_id, reviews.title, comments.review_id, users.name, users.username FROM categories
-- JOIN reviews
-- ON categories.slug = reviews.category
-- JOIN comments
-- ON reviews.review_id = comments.review_id
-- JOIN users
-- ON comments.author = users.username;

-- SELECT * FROM categories;
-- SELECT reviews.review_id, reviews.title, reviews.owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.review_id)::INT
--     AS comment_count
--     FROM reviews
--     FULL JOIN comments
--     ON comments.review_id = reviews.review_id
--     GROUP BY reviews.review_id
--     ORDER BY votes DESC;

-- comment_id`
--   - `votes`
--   - `created_at`
--   - `author` which is the `username` from the users table
--   - `body`

-- SELECT * 
-- FROM comments
-- WHERE review_id = 2;


-- SELECT reviews.*, COUNT(comments.review_id)::INT
--       AS comment_count
--       FROM reviews
--       JOIN comments
--       ON comments.review_id = reviews.review_id
--       WHERE reviews.review_id = reviews.review_id
--       GROUP BY reviews.review_id;


-- SELECT * FROM users;

-- SELECT review_id, title, category FROM reviews;


SELECT * FROM reviews;