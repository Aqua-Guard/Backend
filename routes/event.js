import express from 'express';
import { addOnce, getAllEvents, getOne, updateOne, deleteOne,getAllEventsByUser } from '../controllers/event.js';
import { body } from 'express-validator';
import multer from '../middlewares/multer-config-event.js';

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
    .post(multer,[
        body("name").isLength({ min: 3, max: 30 }).withMessage("Name must be between 3 and 30 characters long."),
        body("DateDebut").isDate().custom(isDateDebutBeforeDateFin).custom(isDateDebutValid).withMessage("DateDebut must be a valid date."),
        body("DateFin").isDate().custom(isDateFinAfterDateDebut).withMessage("DateFin must be a valid date."),
        body("Description").isLength({ min: 10, max: 500 }).withMessage("Description must be between 10 and 100 characters long."),
        body("lieu").isLength({ min: 3, max: 30 }).withMessage()
    ],
        addOnce)
    .get(getAllEvents);

    router
    .route('/eventByCurrentUser')
    .get(getAllEventsByUser);

router
    .route('/:id')
    .get(getOne)
    .put(multer,[
        body("name").isLength({ min: 3, max: 30 }),
        body("DateDebut").isDate().custom(isDateDebutBeforeDateFin).custom(isDateDebutValid),
        body("DateFin").isDate().custom(isDateFinAfterDateDebut),
        body("Description").isLength({ min: 10, max: 100 }),
        body("lieu").isLength({ min: 3, max: 30 })],
        updateOne)
    .delete(deleteOne);
    
   


export default router;