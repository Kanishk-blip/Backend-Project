import mongoose, {Schema} from "mongoose";

const UserSchema=new Schema({

    UserName:{
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
    fullname : {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar : {
        type: String,
        required: true,
    },
    coverimage : {
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
},{timestamps:true})
export const User=mongoose.models("User",UserSchema)