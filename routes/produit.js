import express from 'express';
import { addOnce } from '../controllers/produit.js';

const router = express.Router();
// Define the POST route for adding a product
router.post('/', addOnce);
export default router;
