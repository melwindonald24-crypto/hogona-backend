
import { getPublicProfileService } from "../services/publicProfileService.js";

export const getPublicProfile=async (req,res)=>{
    try {
       return res.status(200).json(await getPublicProfileService(req.params.userId))
        
    } catch (error) {
        res.status(500).json({ error: "something went wrong try again" });
        console.log("error: "+error.message)
    }
}