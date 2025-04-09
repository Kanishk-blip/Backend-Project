import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const UserSchema=new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
        trim:true,
        lowercase:true
    }
    ,
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    }
    ,
    password:{
        type:String,
        required:[true,'Password is required ']
    },
    fullName : {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar : {
        type: String,
        required: true,
    },
    coverImage : {
        type: String,
    },
    refreshToken: {
        type: String
    },
    watchHistory:[{
        type: Schema.Types.ObjectId,
        ref:"Video"
    }
    ]
},{
    timestamps:true
})

UserSchema.pre("save", async function(next){
    if(this.ismodified("password")){
        this.password= await bcrypt.hash(this.password,10)
    }
    next();
})
UserSchema.methods.ispasswordCorrect=async function(password){
await bcrypt.compare(password,this.password)
}
UserSchema.methods.generateAcessToken=function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email: this.email,
        fullName: this.fullName
    },
process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
})
}
UserSchema.methods.generateRefreshtoken=function(){
    return jwt.sign({
        _id:this._id
    },
process.env.REFRESH_TOKEN_SECRET,{
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
})
}
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
