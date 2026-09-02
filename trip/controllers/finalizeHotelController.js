import { confirmHotel } from "../services/HotelMongoServices.js";

//put request to finalize hotel for a trip
export const finalizeHotel = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { hotelId } = req.body;
        await confirmHotel({ tripId, hotelId });
        return res.status(204).json({ message: "Hotel finalized successfully" });

    }catch(error) {
            res.status(500).json({ error: "something went wrong try again" });
        }
    }
