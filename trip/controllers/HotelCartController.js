import { getShortlistedHotels } from "../services/HotelMongoServices.js";

export const getHotelCart = async (req, res) => {
    try {
        const { tripId } = req.params;
        const shortlistedHotels = await getShortlistedHotels(tripId);
        console.log(shortlistedHotels);
        res.status(200).json(shortlistedHotels);

    } catch (error) {
        res.status(500).json({ error: "something went wrong try again" });
    }
};