const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
    appName: {
        type: String,
        required : true
    },
    appCategory : {
        type: String,
        enum:['payroll','travel','finance','CRM','healthcare','education','retail'],
        required : true
    },
    authenticationType : {
            type : String , 
            enum: ['No Auth','auth 2.0','basic auth']
    },
    appDescription : {
        type: String,
        required : true
    },
    connectionLevelParamFields:[{
        paramName : { type : String},
        paramType : {type: String,enum:['Text','Number','Boolean']},
        mandatory : {type:Boolean},
        sensitive : {type: Boolean},
        variableName : {type:String},
        description: {type : String}
    }]
});

const App = mongoose.model("App",AppSchema);
module.exports = App;