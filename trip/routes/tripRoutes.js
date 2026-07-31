
import { Router } from 'express';
import { auth } from '../../Authentication/middleware/authMiddleware.js';
import { setPreferences } from '../controllers/setPreferencesController.js';
import { hotel } from '../controllers/hotelController.js';


const tripRoutes = new Router();

tripRoutes.post("/preferences",auth,setPreferences)
tripRoutes.get("/hotels",auth,hotel)

export default tripRoutes



