import {createRequest, GetAllRequests, updateRequestStatus} from '../controllers/controllers.js';
import express from 'express';
const router = express.Router();

router.post('/request-blood', createRequest);
router.get('/requests', GetAllRequests);
router.put('/requests/:id', updateRequestStatus);

export default router;