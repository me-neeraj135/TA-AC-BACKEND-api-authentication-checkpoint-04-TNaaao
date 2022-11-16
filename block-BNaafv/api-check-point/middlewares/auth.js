/** @format */

let jwt = require(`jsonwebtoken`);
let User = require(`../models/User`);

module.exports = {
  verifyToken: async (req, res, next) => {
    let token = req.headers.authorization;

    try {
      if (token) {
        let payload = await jwt.verify(token, process.env.SECRET);

        let user = await User.findById(payload.userId);

        if (user) {
          req.user = payload;
          return next();
        } else {
          res.status(400).json({ error: `user not found` });
        }
      } else {
        res.status(400).json({ error: `token required` });
      }
    } catch (error) {
      next(error);
    }
  },
};
