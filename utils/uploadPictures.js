const multer = require('multer'); 
const appError = require('./appError');

const multerStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')){
    cb(null, true);
  } else{
    cb(new appError('Please upload only images', 400), false)
  }
};
//const  multerStorage= multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

module.exports = upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'gallery', maxCount: 20 }
  ]);