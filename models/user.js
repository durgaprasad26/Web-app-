const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  nationality: { type: String, required: true },
  number: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
