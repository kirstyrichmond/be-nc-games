\c nc_games_test

-- SELECT categories.slug, categories.description, reviews.review_id, reviews.title, comments.review_id, users.name, users.username FROM categories
-- JOIN reviews
-- ON categories.slug = reviews.category
-- JOIN comments
-- ON reviews.review_id = comments.review_id
-- JOIN users
-- ON comments.author = users.username;

-- SELECT * FROM categories;
-- SELECT * FROM reviews;

SELECT COUNT(comment)
FROM comments


-- SELECT * FROM users;

-- SELECT review_id, title, category FROM reviews;


-- SELECT * FROM comments;