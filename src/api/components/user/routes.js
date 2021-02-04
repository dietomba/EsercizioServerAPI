const express = require('express')
const userRouter = express.Router()
const userController = require('./controller')

userRouter.get('/',(req,res) => userController.findUser(req,res))

userRouter.get('/:id',(req,res) => userController.findUserById(req,res))

userRouter.post('/',(req,res) => userController.addUser(req,res))

userRouter.patch('/:id',(req,res) => userController.updateUser(req,res))

userRouter.delete('/:id',(req,res) => userController.deleteUser(req,res))
