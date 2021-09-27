const Service = require('../models/Service');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');


/****************GET ALL SERVICES*****************/
exports.getAllServices = asyncErr( async (req, res, next) => {
    const services = await Service.find();

    res.status(200).json({
        status: 'success',
        result: services.length,
        data: {
            services
        },
    })
});

/****************GET SERVICE*****************/
exports.getService = asyncErr( async (req, res, next) => {
    const service = await Service.findById(req.params.id);
    if(!service) return next(new appError('no service with this id!', 404));

    res.status(200).json({
        status: 'success',
        data: {
            service
        },
    })
});

/****************CRAETE SERVICE*****************/
exports.createService = asyncErr(async (req,res,next) =>{
    const { serviceName, options } = req.body;
    
    const service = await Service.create({serviceName, options});

    res.status(201).json({
        status: 'success',
        msg: 'service created succussfully!',
        data: {
            service
        }
    })
   
});

/****************UPDATE SERVICE*****************/
exports.updateService = asyncErr( async (req, res, next) => {
    const findService = await Service.findById(req.params.id);
    if(!findService) return next(new appError('this service not exist!', 404));
    
    const service = await Service.findByIdAndUpdate( req.params.id, req.body,{new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        msg: 'service updated successfully',
        data: {
            service
        }
    })
});

/****************DELETE SERVICE*****************/
exports.deleteService = asyncErr( async (req, res, next) => {
    const service = await Service.findById(req.params.id); 
    if(!service) return next(new appError('no service with this id!', 404));

    await service.remove();

    res.status(200).json({
        status: 'success',
        msg: 'service deleted succusfully',
        data: {
            service
        },
    })
});





