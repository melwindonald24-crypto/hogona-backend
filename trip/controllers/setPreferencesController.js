
import { setPreferenceService } from "../services/preferenceServices.js";

export const setPreferences = async (req, res) => {

    try {
        const userId = req.userId
        const { district, startDate, endDate, groupSize, travelType } = req.body
        if (!district || !startDate || !groupSize || !endDate || !travelType) {
            return res.status(400).json({ error: "all the feilds are required" })
        }
        
        const result=await setPreferenceService({ userId, district, startDate, endDate, groupSize, travelType });

        res.status(201).json({tripId:result._id,message:"preferences set successfully"});

    } catch (error) {
        res.status(500).json({ error: "something went wrong try again" });
        console.log(error.message)
        

    }


}