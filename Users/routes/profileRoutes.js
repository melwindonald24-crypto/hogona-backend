import { Router } from 'express';
import { auth } from '../../Authentication/middleware/authMiddleware.js';
import { getMyProfile } from '../controller/myProfileConroller.js';
import { getPublicProfile } from '../controller/publicProfileController.js';


const profileRoutes = new Router();

profileRoutes.get("/profile/:userId",auth,getPublicProfile)
profileRoutes.get("/profile",auth,getMyProfile)



export default profileRoutes
