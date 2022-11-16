/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;
let questionSchema = new Schema({
  tags: [{ type: String }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  slug: { type: String },
});

module.exports = mongoose.model(`Question`, questionSchema);
