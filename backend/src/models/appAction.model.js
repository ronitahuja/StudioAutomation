const mongoose = require("mongoose");

const transcationLevelParamFieldsSchema = new mongoose.Schema({
  paramName: {
    type: String,
    required: true,
  },
  paramType: {
    type: String,
    enum: ["Text", "Number"], // Added 'type' for the field
    required: true,
  },
  mandatory: {
    type: Boolean,
    required: true,
  },
  sensitive: {
    type: Boolean,
    required: true,
  },
  variableName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const AppActionSchema = new mongoose.Schema({
  appActionName: {
    type: String,
    required: true,
    // unique: true,
  },
  language: {
    type: String,
    required: true,
  },
  applicationName: {
    type: String,
    required: true,
  },
  transcationLevelParamFields: [transcationLevelParamFieldsSchema], // Embed the schema here
  code: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const AppAction = mongoose.model("AppAction", AppActionSchema);
module.exports = AppAction;
