import Event from "../models/event.js";
import { validationResult } from "express-validator";


/**
 * Add a new event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function addOnce(req, res) {

    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        Event.create({
            userId: req.body.userId,
            name: req.body.name,
            DateDebut: req.body.DateDebut,
            DateFin: req.body.DateFin,
            Description: req.body.Description,
            lieu: req.body.lieu,
        })
            .then((newEvent) => res.status(201).json({ event: newEvent })).catch((err) => {
                res.status(500).json({ error: err });
            });
    }

}


/**
 * Get all events
 * @param {*} req 
 * @param {*} res 
 */
export function getAll(req, res) {
    Event.find()
        .then((events) => {
            if (events) {
                res.status(200).json({ events: events });
            } else {
                res.status(404).json({ error: "No events found." });
            }
        })
        .catch((err) => res.status(500).json({ error: err }));
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
        .catch((err) => res.status(500).json({ error: err }));
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
        Event.findOneAndUpdate({ "_id": req.params.id }, req.body)
            .then((updatedEvent) => {
                if (updatedEvent) {
                    res.status(200).json({ event: updatedEvent });
                } else {
                    res.status(404).json({ error: "Event not found." });
                }
            })
            .catch((err) => res.status(500).json({ error: err }));
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
        .catch((err) => res.status(500).json({ error: err }));
}


/**
 * Get all events of a specific user
 * @param {*} req 
 * @param {*} res 
 */
export function getAllByUser(req, res) {
    
    Event.find({ "userId": req.params.userId })
        .then((events) => {
            if (events) {
                res.status(200).json({ events: events });
            } else {
                res.status(404).json({ error: "No events found for this user." });
            }
        })
        .catch((err) => res.status(500).json({ error: err }));
}