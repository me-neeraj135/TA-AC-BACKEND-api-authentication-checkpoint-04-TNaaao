/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let answerSchema = new Schema({
  text: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  questionId: { type: Schema.Types.ObjectId, ref: "Question" },
});
module.exports = mongoose.model(`Answer`, answerSchema);
