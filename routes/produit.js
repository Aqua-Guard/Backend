import express from "express";
import multer from "../middlewares/multer-config-produit.js";

const router = express.Router();

import {
  getAll,
  addOnce,
  putOnce,
  deleteOnce
} from "../controllers/produit.js";


router.get("/", getAll);
router.post("/",multer, addOnce);
router.put("/",multer, putOnce);
router.delete("/", deleteOnce);

export default router;