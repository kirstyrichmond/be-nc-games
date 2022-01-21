const db = require("../db/connection.js");

exports.selectCategories = async () => {
  const response = await db.query(`SELECT * FROM categories;`);

  return response.rows;
};