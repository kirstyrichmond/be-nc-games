const { selectUsers, selectUserByUsername } = require("../models/users-models");

exports.getUsers = async (req, res, next) => {
  try {
    const usersData = await selectUsers();
    res.status(200).send({ users: usersData });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await selectUserByUsername(username);
    if (user) {
      res.status(200).send({ user });
    } else {
      res.status(404).send({ msg: "Not found!" });
    }
  } catch (err) {
    next(err);
  }
};
