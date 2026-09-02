import { setShortlistedHotels } from "../services/HotelMongoServices.js";
import { searchHotelDetails ,extractHotelDetails} from "../services/HotelDetailsService.js";
import { getHotelData,setHotelData,createHotelKey } from "../services/HotelRedisService.js";
import { getPreferenceService } from "../services/preferenceServices.js";

//put request to shortlist hotel for a trip
export const shortlistHotel = async (req, res) => {

    try {
        const { tripId} = req.params;
        const { hotelId } = req.body;
        const hotelKey=createHotelKey(tripId,hotelId);
        const cachedHotelData=await getHotelData(hotelKey);
        if (!cachedHotelData) {
            await setShortlistedHotels({tripId, hotelDetails: cachedHotelData});
            return res.status(204).json({ message: "Hotel shortlisted successfully" });
        }
        
        const preference = await getPreferenceService(tripId);
        const hotelDetails=await searchHotelDetails(preference,hotelId);    
        const extractedHotelDetails=extractHotelDetails(hotelDetails);

        await setHotelData({ key: hotelKey, data: extractedHotelDetails, expirationTime: 21600 });

        await setShortlistedHotels({tripId, hotelDetails: extractedHotelDetails});

        res.status(204).json({ message: "Hotel shortlisted successfully" });


    }catch (error) {
        res.status(500).json({ error: "something went wrong try again" });
        console.log(error.message)
  
    }

}