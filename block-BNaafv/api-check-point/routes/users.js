/** @format */

var express = require("express");
var router = express.Router();
var User = require(`../models/User`);
var auth = require(`../middlewares/auth`);

/* GET users listing. */
router.get("/", auth.verifyToken, async function (req, res, next) {
  try {
    res.json({ message: `welcome to user dashboard` });
  } catch (error) {
    next(error);
  }
});

// register user
router.post(`/register`, async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    let token = await user.signInToken();
    console.log(user);

    res.json({ user: user.userInfo(token) });
  } catch (error) {
    next(error);
  }
});

// login user
router.post(`/login`, async (req, res, next) => {
  console.log(req.body);
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: `email/password required` });
  }
  try {
    let user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(400).json({ error: `email not registered` });

    let result = await user.verifyPassword(password);

    console.log(result, `rrr`);
    if (!result) return res.status(400).json({ error: `invalid password` });

    let token = await user.signInToken();
    res.json({ user: user.userInfo(token) });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
