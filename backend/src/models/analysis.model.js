const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
    modelName: {
        type: String,
        required : true
    },
    modelScore: {
        type: Number,
        required : true
    },
});

const Analysis = mongoose.model("Analyse",AnalysisSchema);
module.exports = Analysis;