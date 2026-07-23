import { Router } from 'express';
import { login } from '../controller/loginController.js';
import { register } from '../controller/registerController.js';
import { refresh } from '../controller/refreshController.js';
import { logout } from '../controller/logoutController.js';


const authRoutes = new Router();

authRoutes.post("/login",login)
authRoutes.post("/register",register)
authRoutes.post("/refresh",refresh)
authRoutes.post("/logout",logout)


export default authRoutes;
