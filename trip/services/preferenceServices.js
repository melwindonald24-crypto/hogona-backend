import trip from "../models/trip.js";



export const setPreferenceService=
async ({userId,district, startDate, endDate, groupSize, travelType})=>{
    return await trip.insertOne({
            createdBy: userId,
            preferences: {
                district,
                dateRange: { startDate, endDate },
                groupSize,
                travelType,
            }
        });
}

export const getPreferenceService=async(tripId)=>{

    const tripDocument = await trip.findById(tripId).select("preferences").lean();
    return tripDocument?.preferences ?? null;
}