import { Router } from 'express';
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    checkLog, 
    googleLogin,  
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/logout').delete(verifyJWT, logoutUser);
router.route('/isLoggedIn').get(checkLog);
router.route('/google').post(googleLogin); 

export default router;
