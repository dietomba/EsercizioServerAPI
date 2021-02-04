const userService = require("./service")
const User = require("./service")

const userController = {
  addUser: addUser,
  findUsers: findUser,
  findUserById: findUserById,
  updateUser: updateUser,
  deleteUser: deleteUser,
};

const findUser = async (req, res, next) => {
  let allowed = ["username", "role", "offset", "limit"]

  let filteredQuery = Object.keys(req.query)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: req.query[key],
      };
    }, {});

  try {
    let data = await userService.findAll(filteredQuery);
    res.sendStatus(201).json(data)
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500).json(e)
  }
};

const findUserById = async (req, res) => {
  try {
    let data = await userService.findById(req.params.id);
    res.sendStatus(200).json(data);
  } catch (e) {
    console.log(e);
    res.sendStatus(404).json(e);
  }
};

const addUser = async (req, res, next) => {
  const user = req.body;
  try {
    await userService.create(user);
    res.sendStatus(201).json({ success: true, message: '"User created!"' });
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500).json(e);
  }
};

const updateUser = async (req, res, next) => {
  let allowed = ["username", "role", "email", "password"];

  let filteredBody = Object.keys(req.body)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: req.body[key],
      };
    }, {});

  try {
    await userService.update(filteredBody);
    res.sendStatus(201).json({ success: true, message: "User updated!" });
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500).json(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.sendStatus(201).json({ success: true, message: "User deleted!" });
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500).json(e);
  }
};

module.exports = userController;
