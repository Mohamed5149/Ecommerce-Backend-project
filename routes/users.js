var express = require('express');
const createError = require('http-errors');
const User = require('../models/users');
var router = express.Router();

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  if(!username || !password) return next(createError(400,"missing user name or password"));
  const user = new User({ username, password });
  user.save((err) => {
    if (err) return next(createError(400, err));
    res.send(user);
  });
})

router.post('/login',async (req,res,next)=>{
  const {username,password} = req.body;
  if(!username || !password) return next(createError(400,"missing arguments"));
  const user =  await User.findOne ({username});
  if(!user) return next(createError(401,"User Not Found!"));
  const match = await user.verifyPassword(password);
  if(!match) return next(createError(402,"something went wrong!"));
  const token = await user.generateToken();
  res.send({token,user});
})

module.exports = router;