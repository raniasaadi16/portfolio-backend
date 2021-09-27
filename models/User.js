const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    about: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'you must add email'],
        unique: [true, 'email must be unique'],
        validate: [validator.isEmail, 'you must enter a valid email']
    },
    password:{
        type:String,
        required:[true,'you must enter the password'],
        select: false
    },
    passwordConfirm:{
        type:String,
        required:[true,'you must enter the password confirm field'],
    },
    picture: {
        type: String,
    },
    socialMedia: [{
        title: {
            type:String,
            required: true
        },
        icon: {
            type:String,
            required: true
        },
        url: {
            type:String,
            required: true
        },
        primary: {
            type: Boolean,
            default: false
        }
    }],
    passwordChangedAt: Date
});

// VALIDATE PASSWORD CONFIRM
userSchema.path('passwordConfirm').validate(function(el){
    return el === this.password
}, 'passwords must be the same!');

// ENCRYPT PASSWORD BEFORE SAVING THE DOCUMENT
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

// CHECK IF PASSWORD IS VALIDE
userSchema.methods.checkPassword = async (realPass, userPass) => {
    return await bcrypt.compare(userPass, realPass)
};

// CHECK IF THE PASSWORD IS CHANGED AFTER THE TOKEN ISSUED
userSchema.methods.passwordChangedAfter = function(JWTiat){
    if(this.passwordChangedAt){
        const userpaswordchangedat = parseInt(this.passwordChangedAt.getTime() / 1000,10);
        return userpaswordchangedat > JWTiat;
    };
    return false
}

module.exports = mongoose.model('User', userSchema);