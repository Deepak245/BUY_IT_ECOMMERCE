// const ErrorHandler = require('../Utils/ErrorHandler");

const ErrorHandler = require("../Utils/ErrorHandler");


// this function will get linked to app.js error handing middleware function.
module.exports = (err,req,res,next)=>{
    // console.log(err) // this will print the errors rolling from mongodb and substitute parts.
    err.statusCode = err.statusCode || 500;
    if(process.env.NODE_ENV==='DEVELOPMENT'){
        // err.message = err.message || 'Internal Error';
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })

    }
    if(process.env.NODE_ENV==='PRODUCTION'){
        let error = {...err}
        error.message  = err.message;
        
        // wrong mongoose object ID error
        if(err.name==='CastError'){
            const message = `Resource not found. Invalid:${err.path}`
            
            error = new ErrorHandler(message,400)
        }
        //Handling Mongoose Validation Error
        if(err.name==='validationError'){
            const message = Object.values(err.errors).map(value=>value.message);
            error = new ErrorHandler(message,400)
        }

        // Handling Mongoo Duplicate key Error.
        if(err.code ===11000){
            const message = `Dupliate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message,400)
            // console.log(error.message)
        }

        // Handling Wrong JWT token error.
        if(err.name==='JsonWebTokenError'){
            const message = `JSON WEB TOKEN IS INVALID. TRY AGAIN`
            error = new ErrorHandler(message,400);
        }

        //Handling Expired token error
        if(err.name==='TokenExpiredError'){
            const message = 'JSON WEB TOKEN IS EXPIRED';
            error = new ErrorHandler(message,400);
        }
        res.status(error.statusCode).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }

}

// this is a middle so we should use in app.js file