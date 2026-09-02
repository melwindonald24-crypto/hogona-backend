import redis from "../../config/redisConfig.js";
import crypto from "crypto";
export const setHotelData=async ({key,data,expirationTime})=>{

    await redis.set(key,JSON.stringify(data),{
        EX: expirationTime
    })

}


export const getHotelData=async (key)=>{
    const data=await redis.get(key)
    return JSON.parse(data)
}

export const createHotelKey=(tripId,hotelId)=>{
    return crypto.createHash('sha256').update(`${tripId}-${hotelId}`).digest('hex');
}