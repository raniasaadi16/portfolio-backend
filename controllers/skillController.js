const Skill = require('../models/Skill');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');


/****************GET ALL SKILLS*****************/
exports.getAllSkills = asyncErr( async (req, res, next) => {
    const skills = await Skill.find();

    res.status(200).json({
        status: 'success',
        result: skills.length,
        data: {
            skills
        },
    })
});

/****************GET SKILL*****************/
exports.getSkill = asyncErr( async (req, res, next) => {
    const skill = await Skill.findById(req.params.id);
    if(!skill) return next(new appError('no skill with this id!', 404));

    res.status(200).json({
        status: 'success',
        data: {
            skill
        },
    })
});

/****************CRAETE SKILL*****************/
exports.createSkill = asyncErr(async (req,res,next) =>{
    const { skillName, options } = req.body;
    
    const skill = await Skill.create({skillName, options});

    res.status(201).json({
        status: 'success',
        msg: 'skill created succussfully!',
        data: {
            skill
        }
    })
   
});

/****************UPDATE SKILL*****************/
exports.updateSkill = asyncErr( async (req, res, next) => {
    const findSkill = await Skill.findById(req.params.id);
    if(!findSkill) return next(new appError('this skill not exist!', 404));
    
    const skill = await Skill.findByIdAndUpdate( req.params.id, req.body,{new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        msg: 'skill updated successfully',
        data: {
            skill
        }
    })
});

/****************DELETE SKILL*****************/
exports.deleteSkill = asyncErr( async (req, res, next) => {
    const skill = await Skill.findById(req.params.id); 
    if(!skill) return next(new appError('no skill with this id!', 404));

    await skill.remove();

    res.status(200).json({
        status: 'success',
        msg: 'skill deleted succusfully',
        data: {
            skill
        },
    })
});





