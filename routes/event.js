import express from 'express';
import { addOnce, getAll, getOne, updateOne, deleteOne,getAllByUser } from '../controllers/event.js';
import { body } from 'express-validator';

// Custom validation function to check if DateDebut is before DateFin
const isDateDebutBeforeDateFin = (value, { req }) => {
    const dateDebut = new Date(value);
    const dateFin = new Date(req.body.DateFin);
    return dateDebut < dateFin;
};

// Custom validation function to check if DateFin is after DateDebut
const isDateFinAfterDateDebut = (value, { req }) => {
    const dateFin = new Date(value);
    const dateDebut = new Date(req.body.DateDebut);
    return dateFin > dateDebut;
};

// Custom validation function to check if DateDebut is greater than or equal to the current date
const isDateDebutValid = (value) => {
    const dateDebut = new Date(value);
    const currentDate = new Date();
    return dateDebut >= currentDate;
};

const router = express.Router();


router
    .route('/')
    .post(
        body("name").isLength({ min: 3, max: 30 }),
        body("DateDebut").isDate().custom(isDateDebutBeforeDateFin).custom(isDateDebutValid),
        body("DateFin").isDate().custom(isDateFinAfterDateDebut),
        body("Description").isLength({ min: 10, max: 100 }),
        body("lieu").isLength({ min: 3, max: 30 }),
        addOnce)
    .get(getAll);

router
    .route('/:id')
    .get(getOne)
    .put(body("name").isLength({ min: 3, max: 30 }),
        body("DateDebut").isDate().custom(isDateDebutBeforeDateFin).custom(isDateDebutValid),
        body("DateFin").isDate().custom(isDateFinAfterDateDebut),
        body("Description").isLength({ min: 10, max: 100 }),
        body("lieu").isLength({ min: 3, max: 30 }),
        updateOne)
    .delete(deleteOne);
    
router
    .route('/user/:userId')
    .get(getAllByUser)

export default router;