const mongoose = require('mongoose');


const SocialDetailSchema = new mongoose.Schema({
    maritalstatus: { type: String},
    havechildren: { type: String},
    mothertongue: { type: String},
    religion: { type: String },
    horoscopemustformarriage: { type: String },
    manglik: { type: String},
}, 
{timestamps:true});

module.exports = mongoose.model('Social', SocialDetailSchema);
