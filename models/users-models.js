const db = require("../db/connection.js");

exports.selectUsers = async () => {
  const users = await db.query(`SELECT *
      FROM users;`);

  return users.rows;
};

exports.selectUserByUsername = async (username) => {
  console.log(username);
  const regex = /^[a-z, 0-9]*$/;

  if (!username.match(regex)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request!",
    });
  }

  const user = await db.query(
    `SELECT *
      FROM users
      WHERE username = $1`,
    [username]
  );
  return user.rows[0];
};
