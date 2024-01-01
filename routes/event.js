import express from 'express';
import { addOnce, getAllEvents, getOne, updateOne, deleteOne, getAllEventsByUser, getAllEventsWithParticipations,getEventsNBParticipants,addOnceByAdmin,generateDescriptionWithChat } from '../controllers/event.js';
import { body } from 'express-validator';
import multer from '../middlewares/multer-config-event.js';
import user from '../models/user.js';

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


function isAdmin(req, res, next) {
user.findById(req.user.userId).then(user => {
    // Check if the user has the 'admin' role
    if (user.role === 'admin') {
        return next(); // User is an admin, proceed to the next middleware or route handler
    } else {
        return res.status(403).json({ message: 'Unauthorized' }); // User is not an admin, send a forbidden response
    }
})
}

function isPartenaire(req, res, next) {
    user.findById(req.user.userId).then(user => {
        // Check if the user has the 'admin' role
        if (user.role === 'partenaire') {
            return next(); // User is an admin, proceed to the next middleware or route handler
        } else {
            return res.status(403).json({ message: 'Unauthorized' }); // User is not an admin, send a forbidden response
        }
    })
    }

const router = express.Router();


router
    .route('/')
    .post(isPartenaire,multer, [
        body("name").isLength({ min: 3, max: 30 }).withMessage("Name must be between 3 and 30 characters long."),
        body("DateDebut").custom(isDateDebutBeforeDateFin).custom(isDateDebutValid).withMessage("DateDebut must be a valid date."),
        body("DateFin").custom(isDateFinAfterDateDebut).withMessage("DateFin must be a valid date."),
        body("Description").isLength({ min: 10, max: 500 }).withMessage("Description must be between 10 and 500 characters long."),
        body("lieu").isLength({ min: 3, max: 50 }).withMessage()
    ],
        addOnce)
    .get(getAllEvents);

router
    .route('/eventByCurrentUser')
    .get(isPartenaire,getAllEventsByUser);

router
    .route('/admin')
    .get(isAdmin, getAllEventsWithParticipations)
    .post(isAdmin,multer, [
        body("name").isLength({ min: 3, max: 30 }).withMessage("Name must be between 3 and 30 characters long."),
        body("DateDebut").custom(isDateDebutBeforeDateFin).custom(isDateDebutValid).withMessage("DateDebut must be a valid date."),
        body("DateFin").custom(isDateFinAfterDateDebut).withMessage("DateFin must be a valid date."),
        body("Description").isLength({ min: 10, max: 500 }).withMessage("Description must be between 10 and 500 characters long."),
        body("lieu").isLength({ min: 3, max: 50 }).withMessage()
    ],
        addOnceByAdmin);

router
    .route('/admin/stats')
    .get(isAdmin, getEventsNBParticipants);

router
    .route('/admin/generateDescriptionWithChat/:prompt')
    .get(isAdmin,generateDescriptionWithChat);

/*router
    .route('/admin/updateStatus/:id')
    .put(isAdmin,updateStatus);*/

router
    .route('/:id')
    .get(getOne)
    .put(isPartenaire,multer, [
        body("name").isLength({ min: 3, max: 30 }),
        body("DateDebut").custom(isDateDebutBeforeDateFin).custom(isDateDebutValid),
        body("DateFin").custom(isDateFinAfterDateDebut),
        body("Description").isLength({ min: 10, max: 500 }),
        body("lieu").isLength({ min: 3, max: 50 })],
        updateOne)
    .delete(deleteOne);




export default router;