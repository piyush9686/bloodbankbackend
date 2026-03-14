import express from 'express';
const router = express.Router();

import {AddDonor,GetAllDonors,registerAdmin,loginAdmin,logoutAdmin} from '../controllers/controllers.js'
import { verifyJWT } from '../middleware/auth.middleware.js';
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', verifyJWT,logoutAdmin);
router.post('/donate-blood', AddDonor);
router.get('/donor-list', GetAllDonors);
export default router;