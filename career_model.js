const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const careerSchema = new mongoose.Schema({
   
    highesteducation: { type: String },
    employedIn: { type: String},
    occupation: { type: String },
    income: { type: String },
    randomvalue:{type:String},
}, {timestamps:true});


module.exports = mongoose.model('Career', careerSchema);
