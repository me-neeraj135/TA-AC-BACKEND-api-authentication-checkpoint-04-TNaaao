/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;
let bcrypt = require(`bcrypt`);
let jwt = require(`jsonwebtoken`);

let userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, lowercase: true, required: true },
  email: {
    type: String,
    lowercase: true,
    required: true,
    match: /@/,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true, minlength: 5 },
  image: { type: String },
  bio: { type: String },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  isAdmin: { type: Boolean, default: false },
});

// hash password

userSchema.pre(`save`, async function (next) {
  try {
    let adminEmail = [`welcometoneeraj@gmail.com`];
    if (adminEmail.includes(this.email)) {
      this.isAdmin = true;
    }

    if (this.password && this.isModified(`password`)) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    return next();
  } catch (error) {
    next(error);
  }
});
// verify password

userSchema.methods.verifyPassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    next(error);
  }
};

// signInToken

userSchema.methods.signInToken = async function () {
  let payload = { userId: this._id, email: this.email };
  try {
    let token = jwt.sign(payload, process.env.SECRET);
    return token;
  } catch (error) {
    next(error);
  }
};

// user info

userSchema.methods.userInfo = function (token) {
  return {
    name: this.name,
    username: this.username,
    email: this.email,
    image: this.image,
    bio: this.bio,
    token: token,
  };
};

module.exports = mongoose.model(`User`, userSchema);
