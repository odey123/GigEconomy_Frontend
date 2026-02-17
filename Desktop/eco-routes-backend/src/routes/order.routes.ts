import { Router } from 'express';
import * as orderController from '../controllers/order.controller';

const router = Router();

// GET /api/v1/orders
router.get('/', orderController.getAllOrders);

// GET /api/v1/orders/:id
router.get('/:id', orderController.getOrderById);

// POST /api/v1/orders
router.post('/', orderController.createOrder);

// PUT /api/v1/orders/:id
router.put('/:id', orderController.updateOrder);

// DELETE /api/v1/orders/:id
router.delete('/:id', orderController.deleteOrder);

// PATCH /api/v1/orders/:id/status
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;
