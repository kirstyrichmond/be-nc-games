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
          created_at: expect.any(String),
          votes: 5,
          comment_count: 3,
        });
      });
  });
  test("status 400: responds with error message when passed an empty, but existing review_id", () => {
    return request(app)
      .get("/api/reviews/not-a-valid-endpoint")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid endpoint!");
      });
  });
  test("status 404: responds with error message when passed non-existent review_id", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then((res) => {
          console.log(res)
        expect(res.body.msg).toBe("Not found!");
      });
  });
});
