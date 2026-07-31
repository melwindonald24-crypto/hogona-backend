import trip from "../models/trip.js";

export const setPreferences = async (req, res) => {

    try {
        const userId = req.userId
        const { district, startDate, endDate, groupSize, travelType } = req.body
        if (!district || !startDate || !groupSize || !endDate || !travelType) {
            return res.status(400).json({ error: "all the feilds are required" })
        }
        await trip.insertOne({
            createdBy: userId,
            preferences: {
                district,
                dateRange: { startDate, endDate },
                groupSize,
                travelType,
            }
        })
        res.status(201).json({ message: "preference is set" })

    } catch (error) {
        res.status(500).json({ error: "something went wrong try again" });
        

    }


}