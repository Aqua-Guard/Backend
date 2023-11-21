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
    if (!validationResult(req).isEmpty()) {
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
            .then((newEvent) => res.status(201).json({ event: newEvent }))
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

    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        Event.findOneAndUpdate({ "_id": req.params.id }, req.body, { new: true })
            .then((updatedEvent) => {
                if (updatedEvent) {
                    res.status(200).json({ event: updatedEvent });
                } else {
                    res.status(404).json({ error: "Event not found." });
                }
            })
            .catch((err) => res.status(500).json({ error: err.message }));
    }

}


/**
 * Delete a specific event
 * @param {*} req 
 * @param {*} res 
 */
export function deleteOne(req, res) {

    Event.findOneAndDelete({ "_id": req.params.id })
        .then((deletedEvent) => {
            if (deletedEvent) {
                res.status(200).json({ event: deletedEvent });
            } else {
                res.status(404).json({ error: "Event not found." });
            }
        })
        .catch((err) => res.status(500).json({ error: err.message }));
}


/**
 * Get all events of a specific user
 * @param {*} req 
 * @param {*} res 
 */
export async function getAllByUser(req, res) {
    const userId = req.user.userId;
    console.log('User ID:', userId);

    try {
        const events = await Event.find({ userId: userId })
        .populate('userId', 'username role image');

        if (events.length > 0) {
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
        } else {
            res.status(404).json({ error: "No events found." });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
