import { apierror } from '../utils/apierror.js'
import {asynchandler} from '../utils/asynchandler.js'
 import { User } from '../models/users.models.js'
 import { ApiResponse } from '../utils/ApiResponse.js'
 const registerUser=asynchandler(async (req,res)=>{
    // res.status(200).json({
    //     message:"user is registered"
    // })
    const {fullName,email,password,username}=req.body
    if (
        [fullName,email,password,username].some((field)=>{field?.trim===""})
    ) {
        throw new apierror(400,"this field is required");
    }
    if(await User.findOne({
    $or:[{username},{email}]
}
    )){
        throw new apierror(400,'user already present');
    }
    const avatarpath=req.files?.avatar[0]?.path;
    
    if (!avatarpath) {
        throw new apierror(400, "Avatar file is required")
    }
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    const avatar = await uploadOnCloudinary(avatarpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new apierror(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
 })
 export {registerUser}