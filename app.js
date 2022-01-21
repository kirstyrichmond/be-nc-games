const express = require("express");
const {
  getCategories,
  getReviewById,
  getCommentsByReview,
  getUsers,
  patchReviewByVote,
  postComment,
  deleteComment,
  patchReviewByVote,
} = require("./controllers/games.controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReview);
app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviewByVote);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
