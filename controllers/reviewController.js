const Review = require('../models/Review');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');
const { upload, deleteFile } = require('../utils/googleDrive');

/****************GET ALL REVIEWS*****************/
exports.getAllReviews = asyncErr( async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {
            reviews
        },
    })
});

/****************CRAETE REVIEW*****************/
exports.createReview = asyncErr(async (req,res,next) =>{
    const { clientName, content, rating, country } = req.body;
    const picture = await upload(req.files.picture[0].filename, req.files.picture[0].mimetype, req.files.picture[0].path);
    const review = await Review.create({ clientName, content, rating, country, picture });

    res.status(201).json({
        status: 'success',
        msg: 'review created succussfully!',
        data: {
            review
        }
    })
   
});

/****************DELETE REVIEW*****************/
exports.deleteReview = asyncErr( async (req, res, next) => {
    const review = await Review.findById(req.params.id); 
    if(!review) return next(new appError('no Review with this id!', 404));
    // DELETE PHOTO FROM DRIVE
    deleteFile(review.picture.split('/')[3].split('=')[1])
    await review.remove();

    res.status(200).json({
        status: 'success',
        msg: 'Review deleted succusfully',
        data: {
            review
        },
    })
});





