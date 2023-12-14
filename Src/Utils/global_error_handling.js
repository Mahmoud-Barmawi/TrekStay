export const globalErrorHandling=(err,req,res,next)=>{
    return res.json({message:err.message});
}

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(error => {
            return next(new Error(error.stack));
        });
    };
};

