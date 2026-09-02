import { searchHotelDetails ,extractHotelDetails} from "../services/HotelDetailsService.js";
import { getHotelData,setHotelData,createHotelKey } from "../services/HotelRedisService.js";
import { getPreferenceService } from "../services/preferenceServices.js";



export const getHotelDetails=async (req,res)=>{
    try {
        const{tripId,hotelId}=req.params;
        const hotelKey=createHotelKey(tripId,hotelId);
        const cachedHotelData=await getHotelData(hotelKey);

        if(cachedHotelData){
            return res.status(200).json(cachedHotelData);
        }

        const preference = await getPreferenceService(tripId);
        const hotelDetails=await searchHotelDetails(preference,hotelId);    
        const extractedHotelDetails=extractHotelDetails(hotelDetails);

        await setHotelData({ key: hotelKey, data: extractedHotelDetails, expirationTime: 21600 });

        res.status(200).json(extractedHotelDetails);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching hotel details' });
        console.log(error.message);
    }
}