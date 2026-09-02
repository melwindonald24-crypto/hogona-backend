import trip from "../models/trip.js";




export const setShortlistedHotels = async ({tripId,hotelDetails})=>{

    const HotelDocument={
        placeId: hotelDetails.hotelId,
        name: hotelDetails.name,
        description: hotelDetails.description,
        geom: {
            lat: hotelDetails.latitude,
            lon: hotelDetails.longitude
        },
        thumbnail: hotelDetails.thumbnail,
        rating: hotelDetails.rating,
        total_price: hotelDetails.totalPrice,
        website: hotelDetails.website,
        phone: hotelDetails.phone,
        bookingLinks: hotelDetails.bookingLinks
    }
    return await trip.findByIdAndUpdate(
        tripId,
        {$push:{selectedHotels:HotelDocument}},
        {new:true}
    );

}

export const getShortlistedHotels = async (tripId)=>{
    return await trip.findById(tripId).select("selectedHotels").lean();
}

export const confirmHotel = async ({ tripId, hotelId }) => {

    return await trip.findOneAndUpdate(
        {
            _id: tripId,
            "selectedHotels.placeId": hotelId
        },
        {
            $set: {
                "selectedHotels.$.isConfirmed": true
            }
        },
        {
            returnDocument: "after"
        }
    );

};
