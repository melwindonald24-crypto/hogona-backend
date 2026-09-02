
import { Router } from 'express';
import { auth } from '../../Authentication/middleware/authMiddleware.js';
import { setPreferences } from '../controllers/setPreferencesController.js';
import { getHotels } from '../controllers/getHotelController.js';
import { getHotelDetails } from '../controllers/getHoteldetailsController.js';
import { getHotelCart } from '../controllers/HotelCartController.js';
import { finalizeHotel } from '../controllers/finalizeHotelController.js';
import { shortlistHotel } from '../controllers/shortlistHotelController.js';
import { tripAuthorization } from '../middlewares/tripAuthorizationMiddleware.js';


const HotelRoutes = new Router();

HotelRoutes.post("/trip",auth,setPreferences)
HotelRoutes.get("/trip/:tripId/hotels",auth,tripAuthorization,getHotels)
HotelRoutes.get("/trip/:tripId/hotels/cart",auth,tripAuthorization,getHotelCart)
HotelRoutes.get("/trip/:tripId/hotels/:hotelId",auth,tripAuthorization,getHotelDetails)
HotelRoutes.put("/trip/:tripId/hotels/finalize",auth,tripAuthorization,finalizeHotel)
HotelRoutes.put("/trip/:tripId/hotels/shortlist",auth,tripAuthorization,shortlistHotel)

export default HotelRoutes



