const categoriesRouter = require("express").Router();
const { getCategories } = require("../controllers/categories-contoller");

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
