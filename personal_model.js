const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PersonalDetailSchema = new mongoose.Schema({
    gender: { type: String},
    dob: { type: String},
    height: { type: String},
    country: { type: String },
    city: { type: String },
    residentialStatus: { type: String},
}, 
{timestamps:true});

module.exports = mongoose.model('Personals', PersonalDetailSchema);
