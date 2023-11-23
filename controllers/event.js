import Event from "../models/event.js";
import { validationResult } from "express-validator";
import User from "../models/user.js";


/**
 * Add a new event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function addOnce(req, res) {

    const userId = req.user.userId;
    console.log(req.body);
    console.log(req.file);
    if (!validationResult(req).isEmpty()) {
        console.log({ errors: validationResult(req).array() })
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        Event.create({
            userId: userId,
            name: req.body.name,
            DateDebut: req.body.DateDebut,
            DateFin: req.body.DateFin,
            Description: req.body.Description,
            lieu: req.body.lieu,
            image: req.file.filename,
        })
            .then((newEvent) => res.status(201).json("OK"))
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }

}


/**
 * Get all events
 * @param {*} req 
 * @param {*} res 
 */
export function getAllEvents(req, res) {
    Event.find()
        .populate('userId', 'username role image')
        .then(async events => {
            const transformedevents = await Promise.all(events.map(async event => {
                return {
                    idEvent: event._id,
                    userName: event.userId?.username,
                    userImage: event.userId?.image,
                    eventName: event.name,
                    description: event.Description,
                    eventImage: event.image,
                    DateDebut: event.DateDebut,
                    DateFin: event.DateFin,
                    lieu: event.lieu,
                };
            }));
            res.status(200).json(transformedevents);
        })
        .catch(err => {
            console.error('Error fetching events:', err);
            res.status(500).json({ error: err });
        });
}



/**
 * Get all events of a specific user
 * @param {*} req 
 * @param {*} res 
 */
export function getAllEventsByUser(req, res) {
    const userId = req.user.userId;

    Event.find({ userId: userId })
        .populate('userId', 'username role image')
        .then(async events => {
            if (events.length > 0) {
                const transformedEvents = await Promise.all(events.map(async event => {
                    return {
                        idEvent: event._id,
                        userName: event.userId?.username,
                        userImage: event.userId?.image,
                        eventName: event.name,
                        description: event.Description,
                        eventImage: event.image,
                        DateDebut: event.DateDebut,
                        DateFin: event.DateFin,
                        lieu: event.lieu,
                    };
                }));
                res.status(200).json(transformedEvents);
            } else {
                res.status(404).json({ error: "No events found for this user." });
            }
        })
        .catch(err => {
            console.error('Error fetching user events:', err);
            res.status(500).json({ error: err });
        });
}


/**
 * Get a specific event
 * @param {*} req 
 * @param {*} res 
 */
export function getOne(req, res) {
    Event.findOne({ "_id": req.params.id })
        .then((event) => {
            if (event) {
                res.status(200).json({ event: event });
            } else {
                res.status(404).json({ error: "Event not found." });
            }
        })
        .catch((err) => res.status(500).json({ error: err.message }));
}


/**
 * Update a specific event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function updateOne(req, res) {
    const eventId = req.params.id;

    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    // Extract individual fields from req.body
    const { name, DateDebut, DateFin, Description, lieu } = req.body;

    // Create an object to store the fields that need to be updated
    const updatedFields = {};

    // Check if each field is present in the request body, and add it to the updatedFields object
    if (name) updatedFields.name = name;
    if (DateDebut) updatedFields.DateDebut = DateDebut;
    if (DateFin) updatedFields.DateFin = DateFin;
    if (Description) updatedFields.Description = Description;
    if (lieu) updatedFields.lieu = lieu;

    // Check if the updatedFields object is empty
    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ error: "No valid fields provided for update." });
    }

    

        // Check if a file was uploaded
        if (req.file) {
            updatedFields.image = req.file.filename;
        }

        // Perform the update using findOneAndUpdate
        Event.findOneAndUpdate({ "_id": eventId }, updatedFields, { new: true })
            .then((updatedEvent) => {
                if (updatedEvent) {
                    res.status(200).json("OK");
                } else {
                    res.status(404).json({ error: "Event not found." });
                }
            })
            .catch((err) => res.status(500).json({ error: err.message }));

}



/**
 * Delete a specific event
 * @param {*} req 
 * @param {*} res 
 */
export  function deleteOne(req, res) {

    Event.findOneAndDelete({ "_id": req.params.id })
        .then(async (deletedEvent) => {
            if (deletedEvent) {
                // Delete all participations related to the deleted event
                await Participation.deleteMany({ eventId: eventId });

                res.status(200).json({ message: "Event and associated participations deleted successfully!" });
            } else {
                res.status(404).json({ error: "Event not found." });
            }
        })
        .catch((err) => res.status(500).json({ error: err.message }));
}


