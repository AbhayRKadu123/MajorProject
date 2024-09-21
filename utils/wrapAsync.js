const { error } = require("../schema");

module.exports= wrapAsync=(fn)=>{
    return (req,res,next)=>{
        console.log(error)
fn(req,res,next).catch(next);
    }
}



