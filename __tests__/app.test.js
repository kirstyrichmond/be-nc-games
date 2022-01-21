const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET: /api/categories", () => {
  test("status 200: responds with array of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toBeInstanceOf(Array);
        expect(res.body.categories).toHaveLength(4);
        res.body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status 200: responds with a single review when passed review_id", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject({
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
  test("status 200: responds with review that includes comment_count", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((res) => {
        expect(res.body.review.comment_count).toBe(3);
        expect(res.body.review).toMatchObject({
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
  });
  test("status 400: responds with error message when passed an invalid endpoint", () => {
    return request(app)
      .get("/api/reviews/not-a-valid-endpoint")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request!");
      });
  });
  test("status 404: responds with error message when passed a valid but non-existent review_id", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found!");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("status 200: returns the updated review votes by positive value", () => {
    const reviewUpdate = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(201)
      .then((res) => {
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
          //   comment_count: 0,
        });
      });
  });
  test("status 200: returns the updated review votes by negative value", () => {
    const reviewUpdate = {
      inc_votes: -3,
    };
    return request(app)
      .patch("/api/reviews/13")
      .send(reviewUpdate)
      .expect(201)
      .then((res) => {
        expect(res.body.review.votes).toBe(13);
      });
  });
  test("status 404: returns error message when updating a valid but non existent review_id", () => {
    const reviewUpdate = {
      inc_votes: 22,
    };
    return request(app)
      .patch("/api/reviews/9999")
      .send(reviewUpdate)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("That review_id does not exist!");
      });
  });
  test("status 400: returns error message when passed invalid inc_votes", () => {
    const reviewUpdate = {
      inc_votes: "invalid",
    };
    return request(app)
      .patch("/api/reviews/13")
      .send(reviewUpdate)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request!");
      });
  });
  test("status 400: returns error message when passed inc_votes with another property on request body", () => {
    const reviewUpdate = {
      inc_votes: "invalid",
      name: "Shakira",
    };
    return request(app)
      .patch("/api/reviews/13")
      .send(reviewUpdate)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request!");
      });
  });
});

describe("GET /api/reviews", () => {
  test("status 200: responds with array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        expect(res.body.reviews).toHaveLength(13);
      });
  });
  test("status 200: each review object contains the following properties", () => {
    return request(app)
      .get("/api/reviews")
      .then((res) => {
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
  });
  test("status 200: reviews are sorted by date by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("status 200: reviews are sorted by votes", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("status 200: reviews are sorted by title", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("status 400: invalid sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request!");
      });
  });
  test("status 200: reviews are sorted by votes in ascending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  test("status 200: filters reviews by the 'dexterity' category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        expect(res.body.reviews).toHaveLength(1);
        res.body.reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
      });
  });
  test("status 200: filters reviews by the 'social deduction' category", () => {
    return request(app)
      .get("/api/reviews?category=social%20deduction")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        expect(res.body.reviews).toHaveLength(11);
        res.body.reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  test("status 400: invalid order_by query", () => {
    return request(app)
      .get("/api/reviews?order=invalid")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request!");
      });
  });
  // test("status 404: valid but non-existent category query", () => {
  //   return request(app)
  //     .get("/api/reviews?category=bananas")
  //     .expect(404)
  //     .then((res) => {
  //       expect(res.body.msg).toBe("Not found!");
  //     });
  // });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("returns array of comments for the passed review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array);
        expect(res.body.comments).toHaveLength(3);
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  const newComment = {
    username: "bainesface",
    body: "Best game ever!!!",
  };
  test("status 201: returns new posted comment", () => {
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          review_id: expect.any(Number),
          author: "bainesface",
          body: "Best game ever!!!",
        });
      });
  });
  test('status 404: responds with "not found" when selected review does not/ no longer exists', () => {
    return request(app)
      .post("/api/reviews/9999/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found!");
      });
  });
  test('status 404: responds with "not found" when user does not exist', () => {
    const invalidUser = {
      username: "ninjaKirsty",
      body: "This game is not the best!",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(invalidUser)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found!");
      });
  });
  test('status 400: responds with "bad request" when comment body is empty', () => {
    const noBody = {
      username: "bainesface",
      body: "",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(noBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request!");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: deletes comment and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .expect((res) => {
        expect(res.body).toEqual({});
      });
  });
  test("status 404: responds with 'not found' when comment does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .expect((res) => {
        expect(res.body.msg).toBe("Not found!");
      });
  });
  test("status 404: responds with 'not found' when deleting a comment no longer exists", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .then(() => {
        return request(app)
          .delete("/api/comments/1")
          .expect(404)
          .expect((res) => {
            expect(res.body.msg).toBe("Not found!");
          });
      });
  });
});

describe("GET /api/users", () => {
  test('status 200: responds with array of user objects containing "username" property', () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        // expect(res.body.users).toBeInstanceOf(Array);
        // expect(res.body.users).toHaveLength(4);
        res.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
          });
        });
      });
  });
});
