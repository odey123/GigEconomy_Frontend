import { Router } from 'express';
import * as riderController from '../controllers/rider.controller';

const router = Router();

// GET /api/v1/riders
router.get('/', riderController.getAllRiders);

// GET /api/v1/riders/:id
router.get('/:id', riderController.getRiderById);

// POST /api/v1/riders
router.post('/', riderController.createRider);

// PUT /api/v1/riders/:id
router.put('/:id', riderController.updateRider);

// DELETE /api/v1/riders/:id
router.delete('/:id', riderController.deleteRider);

// GET /api/v1/riders/:id/orders
router.get('/:id/orders', riderController.getRiderOrders);

export default router;
