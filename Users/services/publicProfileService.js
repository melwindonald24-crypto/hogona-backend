import User from "../models/User.js";


export const getPublicProfileService=async (userId)=>{

    //name,tripCount,avatarUrl
    const record=await User.findById(userId).select("name avatarUrl")
     if(!record) return null
    return {
        name:record.name,
        avatar:record.avatarUrl??null
    }
}