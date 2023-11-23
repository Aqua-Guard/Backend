import express from 'express';
import { addOnce, passerCommande, getAll, getOne } from '../controllers/commande.js';

const router = express.Router();

router.post('/ajoutercommande', addOnce);
router.post('/passercommande', passerCommande);
router.get('/', getAll);
router.get('/:id', getOne);

export default router;
