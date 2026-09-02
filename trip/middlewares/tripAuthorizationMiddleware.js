import trip from "../models/trip.js";



export const tripAuthorization=async(req,res,next)=>{
    try{
        const tripId=req.params.tripId;
        const userId=req.userId;
        const authorizedTrip = await trip.findById(tripId)
            .where("createdBy").equals(userId)
            .select("_id")
            .lean();

        if(!authorizedTrip)
        {
            return res.status(403).json({error:"you are not authorized to access this trip"});
        }
        next();

    }catch(error)
    {
        res.status(500).json({ error: "something went wrong try again" });

    }

}