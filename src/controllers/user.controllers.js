import { apierror } from '../utils/apierror.js';
import {asynchandler} from '../utils/asynchandler.js';
import { jwt } from "jsonwebtoken";
 import { User } from '../models/users.models.js';
 import { ApiResponse } from '../utils/ApiResponse.js';


const generatebothAccessandRefreshToken=async(userid)=>{
    const user=await User.findById(userid);
   const accesstoken= await user.generateAcessToken();
   const refreshtoken=await user.generateRefreshtoken();
   user.refreshToken=refreshtoken;
   await user.save({validateBeforeSave:false})
   return {accesstoken,refreshtoken};
}

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
 const loginUser=asynchandler(async (req,res)=>{
    const{username,email,password}=req.body;
    if([username,email].some((field)=>{
        return field?.trim===""
    })){
throw new apierror(400,"username or email is required");
    }
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
if(!existedUser){
throw new apierror(401,"user is not registered firstly register by going to register page");
}
const checkingpassword=existedUser.ispasswordCorrect(password);
if(!checkingpassword){
throw new apierror(402,"password is wrong");
}
const {accesstoken,refreshToken}=await generatebothAccessandRefreshToken(existedUser._id);
const options={
    httpsOnly:true,
    secure:true
}
const givingUserDetail=await User.findById(existedUser._id).select("-password -refreshToken");
return res.status(200)
.cookies("accessToken",accesstoken,options)
.cookies("refreshToken",refreshToken,options)
.json(new ApiResponse(
    200, 
    {
        user: givingUserDetail, accesstoken, refreshToken
    },
    "User logged In Successfully"
))
 })
 const logoutuser=asynchandler(async(req,res)=>{
const id=req.user._id;
const user=User.findByIdAndUpdate(id,{
    refreshToken:undefined
})
 })
 const refreshAcessToken=asynchandler(async(req,res)=>{
    const incomingrefreshToken=req.cookies?.refreshtoken|| req.body.refreshtoken;
    const decoderefreshToken=await jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET)
     const user=await User.findById(decoderefreshToken?._id);
     if(user.refreshtoken!==incomingrefreshToken){
        throw new apierror(400,"refresh token is expired")
        ;
     }
     const {accesstoken,newrefreshtoken}=await generatebothAccessandRefreshToken(user._id);
     const options={
        httpsOnly:true,
        secure:true
     }
     return res.status(200)
     .cookies("accesstoken",accesstoken,options)
     .cookies("refreshtoken",newrefreshtoken,options)
     .json(
        new ApiResponse(
            201,
            {accesstoken,refreshtoken:newrefreshtoken}
            ,
                "ok"
            
        )
     )
    })
    const changePassword=asynchandler(async(req,res)=>{
        const {oldPassword,newPassword}=req.body();
        const user=await User.findById(req.user?._id);
        const ispasswordCorrect=await user.ispasswordCorrect(oldPassword);
        if(!ispasswordCorrect){
            throw new apierror(400,"invalid password");
        }
        user.password=newPassword;
        req.save({validateBeforeSave:false});
        res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "password changed"
            )
        )
    })
    const getCurrentUser=asynchandler(async(req,res)=>{
        const user=await User.findById(req.user?._id).select("-password -refreshToken")
        if(!user){
            throw new apierror(400,"user is not present");
        }
        res.status(200)
        .json(new ApiResponse(
            200,
            {user},
            "user details are succesfully send"
        ))
    })
    const updateAccountDetails = asynchandler(async(req, res) => {
        const {fullName, email} = req.body
    
        if (!fullName || !email) {
            throw new apierror(400, "All fields are required")
        }
    
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullName,
                    email: email
                }
            },
            {new: true}
            
        ).select("-password")
    
        return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
    });
    
 export {registerUser,
    loginUser,
    logoutuser,
    refreshAcessToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails

 }