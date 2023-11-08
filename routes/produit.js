import express from 'express';
import { addOnce , getAll, getOne, updateOne, deleteOne} from '../controllers/produit.js';

const router = express.Router();
router.post('/', addOnce);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', updateOne);
router.delete('/:id', deleteOne);

export default router;