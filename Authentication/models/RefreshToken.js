import mongoose from "mongoose"

const RefreshTokenSchema=new mongoose.Schema({

    refreshToken:{
        type: String,
        required:true,
    },
    expiresAt:{
        type:Date,
        requred:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    deviceInfo:{
        type:String
    },

})

export default mongoose.model("RefreshToken",RefreshTokenSchema)