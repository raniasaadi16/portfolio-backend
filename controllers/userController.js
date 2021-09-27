const User = require('../models/User');
const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');
const filterObj = require('../utils/filterObj');
const { upload } = require('../utils/googleDrive');
const validator = require('validator');
const sendEmail = require('../utils/email');

/****************PROTECT*****************/
exports.protect = asyncErr( async (req, res, next) => {
    let token;
    if(req.cookies.jwt){
        token = req.cookies.jwt
    };

    // CHECK IF THE TOKEN EXIST 
    if(!token) return next(new appError('you must login!', 401));

    // CHECK IF TOKEN IS VALID
    let decoded;
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(new appError('token not valid', 400));
        decoded = user
    });

    // CHECK IF USER STILL EXIST
    const user = await User.findById(decoded.id);
    if(!user) return next(new appError('user no longer exist!', 404));

    // CHECK IF THE PASSWORD WAS CHANGED AFTER THE TOKEN ISSUD
    if(user.passwordChangedAfter(decoded.iat)) return next(new appError('User recently changed password! please login again ',401));

    // FINALLY ^.^
    req.user = user;

    next();
});

/****************LOGIN*****************/
exports.login = asyncErr( async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) return next(new appError('you must enter all fields', 400));

    const user = await User.findOne({email}).select('+password');
    //console.log(await user.checkPassword(user.password, password))
    if(!user || !await user.checkPassword(user.password, password)) return next(new appError('invalid email or password', 404));

    // GENERATE THE TOKEN
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly: true,
    };
    if(req.secure || req.headers('x-forwarded-proto')=== 'https') cookieOption.secure = true;

    res.cookie('jwt', token, cookieOption);

    res.status(200).json({
        status: 'success',
        data: {
            user
        },
        msg: 'Login Successful'
    })
});

//*******************LOGOUT*****************/
exports.logout = asyncErr(async (req,res,next)=>{
    const cookieOption = {
        expires: new Date(Date.now() + 10*1000),
        httpOnly: true,
    };
    if(req.secure || req.headers('x-forwarded-proto')=== 'https') cookieOption.secure = true;
    res.cookie('jwt', 'logout', cookieOption);
    
    res.status(200).json({
        status: 'success',
        msg: 'logout succusfully'
    })
});

//*******************SIGNUP*****************/
exports.signup = asyncErr( async (req, res, next) => {
    const { email, password, passwordConfirm } = req.body;
    if(!email || !password || !passwordConfirm) return next(new appError('missed field', 400));

    const user = await User.create({ email, password, passwordConfirm });
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    })
})

//*******************UPDATE ME*****************/
exports.updateMe = asyncErr( async (req, res, next) => {
    const fields = filterObj(req.body, 'userName', 'about', 'email', 'socialMedia');
    if(req.body.password || req.body.passwordConfirm) return next(new appError('this route is not for updating your password!',400));
    
    if(req.files.picture) {
        fields.picture = await upload(req.files.picture[0].filename, req.files.picture[0].mimetype, req.files.picture[0].path);
    }   
        

    const user = await User.findByIdAndUpdate(req.user.id, fields, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        message: 'informations updated succussfully',
        data: {
            user
        }
    })
});

//*******************UPDATE PASSWORD*****************/
exports.updatePass = asyncErr( async (req, res, next) => {
    const { password, passwordConfirm, currentPassword } = req.body;
    if(!password || !passwordConfirm || !currentPassword) return next(new appError('missed field', 400));

    const user = await User.findById(req.user.id).select('+password');
    if(!await user.checkPassword(user.password, currentPassword)) return next(new appError('wrong password!', 400));

    // UPDATE PASSWORD
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    // LOGIN THE USER WITH NEW TOKEN
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly: true,
        //secure : true
    };
    if(req.secure || req.headers('x-forwarded-proto')=== 'https') cookieOption.secure = true;
    res.cookie('jwt', token, cookieOption);

    res.status(200).json({
        status: 'success',
        message: 'password updated successfully',
        data: {
            user
        }
    })
});

//*******************GET USER*****************/
exports.getUser = asyncErr(async (req, res, next)=>{
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users // i have one user lol
        }
    })
});

//*******************CONTACT*****************/
exports.contact = asyncErr(async (req,res,next) => {
    const { email, name, subject, message } = req.body;
    if(!email || !name || !subject || !message) return next(new appError('missed field !', 400))
    if(!validator.isEmail(email)) return next(new appError('invalid email', 400))
    
    try{
        await sendEmail({name, email, subject, message})
    }catch(err){
        console.log(err);
        return next(new appError('error when sending email!, please try again', 500))
    }

    res.status(200).json('message sent!')
})

