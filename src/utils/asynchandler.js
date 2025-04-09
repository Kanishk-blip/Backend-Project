
const asynchandler=(fn)=>{
    return async(req,res,next)=>{
    try{
await fn(req,res,next)
    }
    catch(err){
        res.status(err.code||500).json({
            success:false,
            msg:err.message
        })
    }
}}
export { asynchandler }