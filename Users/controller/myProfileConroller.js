import { getMyProfileService } from "../services/myProfileService.js";

export const getMyProfile=async (req,res)=>{
    try {
       return res.status(200).json(await getMyProfileService(req.userId))
        
    } catch (error) {
        res.status(500).json({ error: "something went wrong try again" });
        
    }
}