import { extractHotelsService, searchHotelsService } from "../services/serpHotelServices.js";
import trip from "../models/trip.js";

export const hotel=async (req,res)=>{

    try {

        const userId=req.userId
        //console.log(userId)
        const preferences=await trip.findOne().where("createdBy").equals(userId).select("preferences");
        //console.log(preferences)
        const result=await searchHotelsService(preferences)
        const hotels=await extractHotelsService(result)
        res.status(200).json(hotels)
        
    } catch (error) {

        res.status(500).json({ error: "something went wrong try again" });
        console.error(error)
        
    }
    




}