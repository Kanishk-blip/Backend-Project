
const asynchandler=(fn)=>{async(req,res,next)=>{
    try{
await fn(req,res,next)
    }
    catch{
        res.status(err.code||500).json({
            success:false,
            msg:err.message
        })
    }
}}