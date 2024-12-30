const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const imageSchema = new mongoose.Schema({
    image:String,
});
module.exports = mongoose.model('Userimage', imageSchema);

const userSchema = new mongoose.Schema({
  
    email: { type: String },
    password: { type: String },
    fullname: { type: String },
    mobilenumber: { type: String },
    
}, {timestamps:true});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('UserRegistration', userSchema);
