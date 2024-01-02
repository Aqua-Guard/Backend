import express from "express";

const router = express.Router();

import {
  getAll,
  addOnce,
  putOnce,
  deleteOnce
} from "../controllers/produit.js";


router.get("/", getAll);
router.post("/", addOnce);
router.put("/", putOnce);
router.delete("/", deleteOnce);

export default router;