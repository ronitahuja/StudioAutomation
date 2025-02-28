const mongoose = require("mongoose");

const FunctionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: null },
  syntax: { type: String, default: null },
  parameters: { type: Array, default: [] },
  return_value: { type: String, default: null },
  example: { type: String, default: null },
  embedding: { type: Array, default: [] }, // Storing embedding vector
});

module.exports = mongoose.model("Function", FunctionSchema);
