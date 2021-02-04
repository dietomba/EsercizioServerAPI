const User = require("../model")

const userService = {
  findAll: findAll,
  create: create,
  findById: findById,
  deleteUser: deleteUser,
  update: update,
}

const findAll = async (filter) => {
  let paginationObj = {}
  if (filter.limit) paginationObj.limit = filter.limit
  if (filter.offset) paginationObj.offset = filter.offset
  let orderArray = []
  for (let i = 0; i < filter.order.length; i++) {
    orderArray.push(filter.order[i].key)
    orderArray.push(filter.order[i].value)
  }
  return User.findAll(
    {
      attributes: ["username", "link"],
      where: filter,
      order: orderArray,
    },
    paginationObj
  )
}

const findById = async (id) => {
  return User.findByPk(id);
}

const deleteUser = async (id) => {
  return User.destroy({ where: { _id: id } });
}

const create = async (user) => {
  var newUser = new User(user)
  return newUser.save()
}

const update = async (data, id) => {
  return User.update(data, { where: { _id: id } })
}

module.exports = userService
