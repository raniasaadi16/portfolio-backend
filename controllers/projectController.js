const Project = require('../models/Project');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');
const filterObj = require('../utils/filterObj');
const { upload, deleteFile } = require('../utils/googleDrive');

/****************GET ALL PROJECTs*****************/
exports.getAllProjects = asyncErr( async (req, res, next) => {
    const projects = await Project.find();

    res.status(200).json({
        status: 'success',
        result: projects.length,
        data: {
            projects
        },
    })
});

/****************GET PROJECT*****************/
exports.getProject = asyncErr( async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if(!project) return next(new appError('no project with this id!', 404));

    res.status(200).json({
        status: 'success',
        data: {
            project
        },
    })
});

/****************CRAETE PROJECT*****************/
exports.createProject = asyncErr(async (req,res,next) =>{  
    
    const { projectName, description, url, sourceCode, tools, category } = req.body;
    let picture;
    let gallery =[];
    if(req.files.picture) {
        picture = await upload(req.files.picture[0].filename, req.files.picture[0].mimetype, req.files.picture[0].path);
        
    }
    
    if(req.files.gallery) {       
        const promise = req.files.gallery.map(async (photo, i) => {
            gallery[i] = await upload(photo.filename, photo.mimetype, photo.path)
            return gallery[i]
        })
        await Promise.all(promise)     
    };   
    
    const project = await Project.create({projectName, description, url, sourceCode, tools, category, picture, gallery});

    res.status(201).json({
        status: 'success',
        msg: 'project created succussfully!',
        data: {
            project
        }
    })
    
   
});

/****************UPDATE PROJECT*****************/
exports.updateProject = asyncErr( async (req, res, next) => {
    const findproject = await Project.findById(req.params.id);
    if(!findproject) return next(new appError('this project not exist!', 404));

    const fields = filterObj(req.body, 'projectName', 'url', 'description', 'tools', 'category', 'sourceCode');
    
    if(req.files) {
        if(req.files.picture) {
            // DELETE THE PREV PHOTO
            deleteFile(findproject.picture.split('/')[3].split('=')[1])
            // ADD THE NEW ONE
            fields.picture = await upload(req.files.picture[0].filename, req.files.picture[0].mimetype, req.files.picture[0].path);
        }   
        if(req.files.gallery) {
            // DELETE THE PREV PHOTOS
            // frontend issue!
            findproject.gallery.map(photo => {
                deleteFile(photo.split('/')[3].split('=')[1])
            })
            // ADD THE NEW ONES
            fields.gallery = [];
            const promise = req.files.gallery.map(async (photo, i) => {
                fields.gallery[i] = await upload(photo.filename, photo.mimetype, photo.path)
                return fields.gallery[i]
            })
            await Promise.all(promise)    
        }  
    }
    
    const project = await Project.findByIdAndUpdate( req.params.id, fields,{new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        msg: 'project updated successfully',
        data: {
            project
        }
    })
});

/****************DELETE PROJECT*****************/
exports.deleteProject = asyncErr( async (req, res, next) => {
    const project = await Project.findById(req.params.id); 
    if(!project) return next(new appError('no project with this id!', 404));
    // DELETE FILES FROM GOOGLE DRIVE
    project.gallery.map(photo => {
        deleteFile(photo.split('/')[3].split('=')[1])
    })
    deleteFile(project.picture.split('/')[3].split('=')[1])
    await project.remove();

    res.status(200).json({
        status: 'success',
        msg: 'project deleted succusfully',
        data: {
            project
        },
    })
});

/****************GET ALL CATEGORIES*****************/
exports.getCategories = asyncErr(async (req, res, next) => {
    const categories = await Project.aggregate([
      {
        $match: {
        }
      },
      {
        $group: {
          _id: '$category',
        }
      },
      
    ]);
  
    res.status(200).json({
      status: 'success',
      result: categories.length,
      data: {
        categories
      }
    });
  });




