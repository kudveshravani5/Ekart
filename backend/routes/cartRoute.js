import express from 'express';

import {
  addToCart,
  getCart,
  moveToCart,
  removeFromCart,
  removeSaveForLater,
  saveForLater,
  
  updateQuantity
} from '../controllers/cartController.js'

import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.get('/', isAuthenticated, getCart);
router.post('/add', isAuthenticated, addToCart);
router.put('/update', isAuthenticated, updateQuantity);
router.delete('/remove', isAuthenticated, removeFromCart);
router.post("/save-for-later", isAuthenticated, saveForLater);
router.post("/move-to-cart", isAuthenticated, moveToCart);
router.delete("/save-for-later/remove", isAuthenticated,removeSaveForLater );

export default router;




