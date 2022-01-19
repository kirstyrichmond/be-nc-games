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
        //   console.log(res.body.review)
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
        // console.log(res.body.reviewExists[0])
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
          // comment_count: 0,
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
