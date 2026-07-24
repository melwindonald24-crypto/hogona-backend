import User from "../models/User.js";


export const getMyProfileService=async (userId)=>{

    //name,createdAt,tripCount,avatarUrl,tripDetails
    
    const record=await User.findById(userId).select("name createdAt avatarUrl")

    if(!record) return null
    return {
        name:record.name,
        createdAt:record.createdAt,
        avatar:record.avatarUrl??null
    }
}
