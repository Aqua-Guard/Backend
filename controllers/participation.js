import Participation from "../models/participation.js";
import { validationResult } from "express-validator";

/**
 * Add a new participation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function addOnce(req, res) {

    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        Participation.create({
            userId: req.body.userId,
            eventId: req.body.eventId,
        })
            .then((newParticipation) => res.status(201).json({ participation: newParticipation })).catch((err) => {
                res.status(500).json({ error: err });
            });
    }

}


/**
 * Get all participations
 * @param {*} req 
 * @param {*} res 
 */
export function getAll(req, res) {

    Participation.find()
        .then((participations) => {
            if (participations.length > 0) {
                res.status(200).json({ participations: participations });
            } else {
                res.status(404).json({ error: "No participations found." });
            }
        })
        .catch((err) => res.status(500).json({ error: err }));
}


/**
 * Delete a specific participation
 * @param {*} req
 * @param {*} res 
 */
export function deleteOne(req, res) {

    Participation.findOneAndDelete({ "_id": req.params.id })
        .then((participation) => {
            if (participation) {
                res.status(200).json({ message: "participation deleted successfully." });
            } else {
                res.status(404).json({ error: "participation not found." });
            }
        })
        .catch((err) => res.status(500).json({ error: err }));
}


/**
 * Get all participations by user
 * @param {*} req 
 * @param {*} res 
 */
export function getAllByUser(req, res) {

    Participation.find({ "userId": req.params.userId })
        .then((participations) => {
            if (participations.length > 0) {
                res.status(200).json({ participations: participations });
            } else {
                res.status(404).json({ error: "No participations found for this user." });
            }
        })
        .catch((err) => res.status(500).json({ error: err }));
}

