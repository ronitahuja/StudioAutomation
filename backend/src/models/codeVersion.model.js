const CodeVersionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },

  versionNumber: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", 
//     required: true,
//   },

  description: {
    type: String,
    default: "",
  }
});

module.exports = mongoose.model("CodeVersion", CodeVersionSchema);