import { v2 as cloudinary } from 'cloudinary';

import fs from "fs"

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEYS, 
        api_secret: process.env.CLOUDINARY_API_SECRETS // Click 'View API Keys' above to copy your API secret
    });
    
 const uploadOnCloudinary=async (localfilepath)=>{
    try{
        if(!localfilepath){
            return null;
        }
        const uploaded=await cloudinary.upload.uploaded(localfilepath,{
            resource_type:"auto"
        })
    }
    catch(error){
           fs.unlinkSync(localfilepath)
           return null;
    }
 }