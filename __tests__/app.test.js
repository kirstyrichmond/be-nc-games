const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const reviews = require("../db/data/test-data/reviews.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("status 404: responds with error message when passed invalid url", async () => {
    const test = await request(app).get("/not-valid-url").expect(404);
    expect(test.body.msg).toBe("Not found!");
  });
});

describe("GET: /api/categories", () => {
  test("status 200: responds with array of categories", async () => {
    const res = await request(app).get("/api/categories").expect(200);
    const categoriesApi = res.body.categories;
    expect(categoriesApi).toBeInstanceOf(Array);
    expect(categoriesApi).toHaveLength(4);
    categoriesApi.forEach((category) => {
      expect(category).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status 200: responds with a single review when passed review_id", async () => {
    const res = await request(app).get("/api/reviews/3").expect(200);
    const reviews = res.body.review;
    expect(reviews).toMatchObject({
      review_id: 3,
      title: "Ultimate Werewolf",
      designer: "Akihisa Okui",
      owner: "bainesface",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "We couldn't find the werewolf!",
      category: "social deduction",
      created_at: expect.any(String),
      votes: 5,
    });
  });
});
test("status 200: responds with review that includes comment_count", async () => {
  const res = await request(app).get("/api/reviews/3").expect(200);
  const review = res.body.review;
  expect(review.comment_count).toBe(3);
  expect(review).toMatchObject({
    review_id: 3,
    title: "Ultimate Werewolf",
    designer: "Akihisa Okui",
    owner: "bainesface",
    review_img_url:
      "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
    review_body: "We couldn't find the werewolf!",
    category: "social deduction",
    created_at: "2021-01-18T10:01:41.251Z",
    votes: 5,
    comment_count: 3,
  });
});

test("status 400: responds with error message when passed an invalid endpoint", async () => {
  const res = await request(app)
    .get("/api/reviews/not-a-valid-endpoint")
    .expect(400);
  expect(res.body.msg).toBe("Bad request!");
});
test("status 404: responds with error message when passed a valid but non-existent review_id", async () => {
  const res = await request(app).get("/api/reviews/999999").expect(404);
  expect(res.body.msg).toBe("Not found!");
});

describe("PATCH /api/reviews/:review_id", () => {
  test("status 200: returns the updated review votes by positive value", async () => {
    const reviewUpdate = {
      inc_votes: 10,
    };
    const res = await request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(201);
    expect(res.body.review.votes).toBe(11);
    expect(res.body.review).toMatchObject({
      review_id: 1,
      title: "Agricola",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "Farmyard fun!",
      category: "euro game",
      created_at: "2021-01-18T10:00:20.514Z",
      votes: 11,
    });
  });
  test("status 200: returns the updated review votes by negative value", async () => {
    const reviewUpdate = {
      inc_votes: -3,
    };
    const res = await request(app)
      .patch("/api/reviews/13")
      .send(reviewUpdate)
      .expect(201);
    expect(res.body.review.votes).toBe(13);
  });
  test("status 200: returns unchanged review when missing inc_votes", async () => {
    const res = await request(app).patch("/api/reviews/1").send().expect(200);
    expect(res.body.review.votes).toBe(1);
    expect(res.body.review).toMatchObject({
      review_id: 1,
      title: "Agricola",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "Farmyard fun!",
      category: "euro game",
      created_at: "2021-01-18T10:00:20.514Z",
      votes: 1,
    });
  });
  test("status 404: returns error message when updating a valid but non existent review_id", async () => {
    const reviewUpdate = {
      inc_votes: 22,
    };
    const res = await request(app)
      .patch("/api/reviews/9999")
      .send(reviewUpdate)
      .expect(404);
    expect(res.body.msg).toBe("That review_id does not exist!");
  });
  test("status 400: returns error message when passed invalid inc_votes", async () => {
    const reviewUpdate = {
      inc_votes: "invalid",
    };
    const res = await request(app)
      .patch("/api/reviews/13")
      .send(reviewUpdate)
      .expect(400);
    expect(res.body.msg).toBe("Bad request!");
  });
  test("status 400: returns error message when passed inc_votes with another property on request body", async () => {
    const reviewUpdate = {
      inc_votes: "invalid",
      name: "Shakira",
    };
    const res = await request(app)
      .patch("/api/reviews/13")
      .send(reviewUpdate)
      .expect(400);
    expect(res.body.msg).toBe("Bad request!");
  });
});

describe("GET /api/reviews", () => {
  test("status 200: responds with array of review objects with each object containing the following properties", async () => {
    const res = await request(app).get("/api/reviews");
    expect(res.body.reviews).toBeInstanceOf(Array);
    expect(res.body.reviews).toHaveLength(13);
    res.body.reviews.forEach((review) => {
      expect(review).toMatchObject({
        review_id: expect.any(Number),
        title: expect.any(String),
        owner: expect.any(String),
        review_img_url: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });
  });
  test("status 200: reviews are sorted by date by default", async () => {
    const res = await request(app).get("/api/reviews").expect(200);
    expect(res.body.reviews).toBeSortedBy("created_at", {
      descending: true,
    });
  });
  test("status 200: reviews are sorted by votes", async () => {
    const res = await request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200);
    expect(res.body.reviews).toBeSortedBy("votes", {
      descending: true,
    });
  });
  test("status 200: reviews are sorted by title", async () => {
    const res = await request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200);
    expect(res.body.reviews).toBeSortedBy("title", {
      descending: true,
    });
  });
  test("status 400: invalid sort_by query", async () => {
    const res = await request(app)
      .get("/api/reviews?sort_by=invalid")
      .expect(400);
    expect(res.body.msg).toBe("Bad request!");
  });
  test("status 200: reviews are sorted by votes in ascending order", async () => {
    const res = await request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200);
    expect(res.body.reviews).toBeSortedBy("votes", {
      descending: false,
    });
  });
  test("status 200: filters reviews by the 'dexterity' category", async () => {
    const res = await request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200);
    const reviews = res.body.reviews;
    expect(reviews).toBeInstanceOf(Array);
    expect(reviews).toHaveLength(1);
    reviews.forEach((review) => {
      expect(review.category).toBe("dexterity");
    });
  });
  test("status 200: filters reviews by the 'social deduction' category", async () => {
    const res = await request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200);
    const reviews = res.body.reviews;
    expect(reviews).toBeInstanceOf(Array);
    expect(reviews).toHaveLength(11);
    reviews.forEach((review) => {
      expect(review.category).toBe("social deduction");
    });
  });
  // test('status 404: responds with "not found" when passed a category that does not exist', async () => {
  //   const res = await request(app)
  //     .get("/api/reviews?category=bananas")
  //     .expect(404);
  //   expect(res.body.msg).toBe("Not found!");
  // });
});
test("status 400: invalid order_by query", async () => {
  const res = await request(app).get("/api/reviews?order=invalid").expect(400);
  expect(res.body.msg).toBe("Bad request!");
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("returns array of comments for the passed review_id", async () => {
    const res = await request(app).get("/api/reviews/2/comments").expect(200);
    const reviewComments = res.body.comments;
    expect(reviewComments).toBeInstanceOf(Array);
    expect(reviewComments).toHaveLength(3);
    reviewComments.forEach((comment) => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
      });
    });
  });
  test("status 404: returns error message when passed a non-existent review_id", async () => {
    const res = await request(app)
      .get("/api/reviews/9999/comments")
      .expect(404);
    expect(res.body.msg).toBe("Not found!");
  });
});

describe.only("POST /api/reviews", () => {
  const newReview = {
    title: "Monopoly Disney",
    designer: "Disney",
    owner: "mallionaire",
    review_img_url:
      "https://cf.geekdo-images.com/s4jUeESvnl4H14OCioWjmw__imagepage/img/PFfgncCsBw6M-pi0XcJToC7GqnU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic55937.jpg",
    review_body: "Family fun!",
    category: "social deduction",
  };
  test("status 201: returns new posted review into review endpoint", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(201);
    expect(res.body.review).toBeInstanceOf(Array);
    const res2 = await request(app).get("/api/reviews");
    // console.log(res2.body.reviews.length);
    expect(res2.body.reviews.length).toBe(14);
  });
  // test("status 201: returns new posted review", async () => {
  //   const res = await request(app)
  //     .post("/api/reviews/14")
  //     .send(newReview)
  //     .expect(201);
  //   expect(res.body.review).toMatchObject({
  //     review_id: 14,
  //     title: "Monopoly Disney",
  //     designer: "Disney",
  //     owner: "mallionaire",
  //     review_img_url:
  //       "https://cf.geekdo-images.com/s4jUeESvnl4H14OCioWjmw__imagepage/img/PFfgncCsBw6M-pi0XcJToC7GqnU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic55937.jpg",
  //     review_body: "Family fun!",
  //     category: "social deduction",
  //     created_at: expect.any(String),
  //   });
  // });
  // test('status 404: responds with "not found" when user is not logged in', async () => {
  //   const invalidUser = {
  //     title: "Monopoly Disney",
  //     designer: "Disney",
  //     owner: "",
  //     review_img_url:
  //       "https://cf.geekdo-images.com/s4jUeESvnl4H14OCioWjmw__imagepage/img/PFfgncCsBw6M-pi0XcJToC7GqnU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic55937.jpg",
  //     review_body: "Family fun!",
  //     category: "social deduction",
  //   };
  //   const res = await request(app)
  //     .post("/api/reviews/14")
  //     .send(invalidUser)
  //     .expect(404);
  //   expect(res.body.msg).toBe("Not found!");
  // });
  // test.only('status 400: responds with "bad request" when review_body is empty', async () => {
  //   const noReviewBody = {
  //     title: "Monopoly Disney",
  //     designer: "Disney",
  //     owner: "mallionaire",
  //     review_img_url:
  //       "https://cf.geekdo-images.com/s4jUeESvnl4H14OCioWjmw__imagepage/img/PFfgncCsBw6M-pi0XcJToC7GqnU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic55937.jpg",
  //     review_body: "",
  //     category: "social deduction",
  //   };
  //   const res = await request(app)
  //     .post("/api/reviews/2/comments")
  //     .send(noReviewBody)
  //     .expect(400);
  //   expect(res.body.msg).toBe("Bad request!");
  // });
});

describe("DELETE /api/reviews/:review_id", () => {
  // test("status 204: deletes review comments if review has any", async () => {
  //   const res = await request(app).delete("/api/reviews/1/comments").expect(204);

  //   expect(res.body).toEqual({});
  // });
  test("status 204: deletes review and responds with no content", async () => {
    const res = await request(app).delete("/api/reviews/1").expect(204);

    expect(res.body).toEqual({});
  });
  test("status 404: responds with 'not found' when review does not exist", async () => {
    const res = await request(app).delete("/api/reviews/9999").expect(404);
    expect(res.body.msg).toBe("Not found!");
  });
  test("status 404: responds with 'not found' when deleting a review no longer exists", async () => {
    const res = await request(app).delete("/api/reviews/1").expect(204);
    expect(res.body).toEqual({});
    const resNo2 = await request(app).delete("/api/reviews/1").expect(404);
    expect(resNo2.body.msg).toBe("Not found!");
  });
});

describe("GET /api/users", () => {
  test('status 200: responds with array of user objects containing "username" property', async () => {
    const res = await request(app).get("/api/users").expect(200);
    const users = res.body.users;
    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(4);
    users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
      });
    });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  const newComment = {
    username: "bainesface",
    body: "Best game ever!!!",
  };
  test("status 201: returns new posted comment", async () => {
    const res = await request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(201);
    expect(res.body.comment).toMatchObject({
      comment_id: expect.any(Number),
      votes: 0,
      created_at: expect.any(String),
      review_id: expect.any(Number),
      author: "bainesface",
      body: "Best game ever!!!",
    });
  });
  test('status 404: responds with "not found" when selected review does not/ no longer exists', async () => {
    const res = await request(app)
      .post("/api/reviews/9999/comments")
      .send(newComment)
      .expect(404);
    expect(res.body.msg).toBe("Not found!");
  });
  test('status 404: responds with "not found" when user does not exist', async () => {
    const invalidUser = {
      username: "ninjaKirsty",
      body: "This game is not the best!",
    };
    const res = await request(app)
      .post("/api/reviews/2/comments")
      .send(invalidUser)
      .expect(404);
    expect(res.body.msg).toBe("Not found!");
  });
  test('status 400: responds with "bad request" when comment body is empty', async () => {
    const noBody = {
      username: "bainesface",
      body: "",
    };
    const res = await request(app)
      .post("/api/reviews/2/comments")
      .send(noBody)
      .expect(400);
    expect(res.body.msg).toBe("Bad request!");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: deletes comment and responds with no content", async () => {
    const res = await request(app).delete("/api/comments/1").expect(204);
    expect(res.body).toEqual({});
  });
  test("status 404: responds with 'not found' when comment does not exist", async () => {
    const res = await request(app).delete("/api/comments/9999").expect(404);
    expect(res.body.msg).toBe("Not found!");
  });
  test("status 404: responds with 'not found' when deleting a comment no longer exists", async () => {
    const res = await request(app).delete("/api/comments/1").expect(204);
    expect(res.body).toEqual({});
    const resNo2 = await request(app).delete("/api/comments/1").expect(404);
    expect(resNo2.body.msg).toBe("Not found!");
  });
});

describe("GET /api/users", () => {
  test('status 200: responds with array of user objects containing "username" property', async () => {
    const res = await request(app).get("/api/users").expect(200);
    const users = res.body.users;
    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(4);
    users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
      });
    });
  });
});

describe("GET /api/users/:username", () => {
  test("status 200: responds with a user object when passed a valid username", async () => {
    const res = await request(app).get("/api/users/mallionaire").expect(200);
    expect(res.body.user).toMatchObject({
      username: "mallionaire",
      name: "haz",
      avatar_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    });
  });
  test('status 404: responds with "not found" when passed a non-existent username', async () => {
    const res = await request(app).get("/api/users/mickeymouse88").expect(404);
    expect(res.body.msg).toBe("Not found!");
  });
  test('status 400: reponds with "bad request" when passed an invalid username', async () => {
    const res = await request(app)
      .get("/api/users/invalid-username!")
      .expect(400);
    expect(res.body.msg).toBe("Bad request!");
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("status 201: updates selected comment vote with positive value", async () => {
    const commentUpdate = {
      inc_votes: 5,
    };
    const res = await request(app)
      .patch("/api/comments/2")
      .send(commentUpdate)
      .expect(201);
    const comment = res.body.comment;
    expect(comment.votes).toBe(18);
    expect(comment).toMatchObject({
      comment_id: 2,
      body: "My dog loved this game too!",
      votes: 18,
      author: "mallionaire",
      review_id: 3,
      created_at: "2021-01-18T10:09:05.410Z",
    });
  });
  test("status 200: updates selected comment vote with negative value", async () => {
    const commentUpdate = {
      inc_votes: -2,
    };
    const res = await request(app)
      .patch("/api/comments/6")
      .send(commentUpdate)
      .expect(201);
    const comment = res.body.comment;
    expect(comment.votes).toBe(8);
    expect(comment).toMatchObject({
      comment_id: 6,
      body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
      votes: 8,
      author: "philippaclaire9",
      review_id: 3,
      created_at: "2021-03-27T19:49:48.110Z",
    });
  });
  test('status 404: responds with "not found" when updating a non-existing comment', async () => {
    const commentUpdate = {
      inc_votes: 8,
    };
    const res = await request(app)
      .patch("/api/comments/9999")
      .send(commentUpdate)
      .expect(404);
    expect(res.body.msg).toBe("Not found!");
  });
  test('status 400: responds with "Bad request! when passed invalid inc_votes', async () => {
    const commentUpdate = {
      inc_votes: "invalid",
    };
    const res = await request(app)
      .patch("/api/comments/1")
      .send(commentUpdate)
      .expect(400);
    expect(res.body.msg).toBe("Bad request!");
  });
  test("status 201: returns comment with updated votes when passed inc_votes with another property on request body", async () => {
    const commentUpdate = {
      inc_votes: 100,
      author: "cooljmessy",
    };
    const res = await request(app)
      .patch("/api/comments/6")
      .send(commentUpdate)
      .expect(201);
    const comment = res.body.comment;
    expect(comment.votes).toBe(110);
    expect(comment).toMatchObject({
      comment_id: 6,
      body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
      votes: 110,
      author: "philippaclaire9",
      review_id: 3,
      created_at: "2021-03-27T19:49:48.110Z",
    });
  });
});
