const express = require("express");
const endpoints = require("./endpoints.json");
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReview,
  getUsers,
  patchReviewByVote,
  postComment,
  deleteComment,
} = require("./controllers/games.controller");
const app = express();
app.use(express.json());

app.get("/api", (req, res, next) => {
  res.send(endpoints);
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReview);
app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviewByVote);

app.post("/api/reviews/:review_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

// app.use((err, req, res, next) => {
//   if (err.code === "42703") {
//     res.status(404).send({ msg: "Not found!" });
//   } else {
//     next(err);
//   }
// });

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703") {
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
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
