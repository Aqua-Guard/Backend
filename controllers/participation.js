import Participation from "../models/participation.js";
import User from '../models/user.js';
import Event from '../models/event.js'; 



/**
 * Add a new participation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export async function addOnce(req, res) {
    const userId = req.user.userId;
    console.log(userId);

    if (!userId) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
    }

    try {
        const user = await User.findOne({ "_id": userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Increment the nbPts field
        user.nbPts += 1;

        // Save the updated user record
        await user.save();

        // Create the participation record
        const newParticipation = await Participation.create({
            userId: userId,
            eventId: req.params.eventId,
        });

        res.status(201).json({message :"participation added succesfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Internal Server Error' });
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
 * Get all participations by user
 * @param {*} req 
 * @param {*} res 
 */
export async function getAllByUser(req, res) {
    const userId = req.user.userId;
    try {
        const participations = await Participation.find({ userId: userId })
            .populate('eventId', 'name DateDebut');

        if (participations.length > 0) {
            const transformedParticipations = await Promise.all(participations.map(async participation => {
                const event = await Event.findById(participation.eventId);
            

  
            return {
                _id: participation._id,
                DateEvent: event.DateDebut,
                Eventname: event.name,
            };
     
            }));

            res.status(200).json(transformedParticipations);
        } else {
            res.status(404).json({ error: "No participations found for this user." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
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





export async function isParticipated(req, res) {
    const eventId = req.params.eventId;
    const userId = req.user.userId; // Assuming you have user information in req.user

    try {
        // Check if the user has liked the post
        const participation = await Participation.findOne({ eventId: eventId, userId: userId });

        // Return true if the like exists, otherwise false
        res.status(200).json( !!participation );
    } catch (error) {
        console.error('Error checking participation status:', error);
        res.status(500).json({ error: error.message });
    }
}


export function deleteParticipation(req, res) {
    const eventId = req.params.eventId;
    const userId = req.user.userId; 

    Participation.findOneAndDelete({ eventId: eventId, userId: userId })
        .then((participation) => {
            if (participation) {
                res.status(200).json({ message: "participation deleted successfully." });
            } else {
                res.status(404).json({ error: "participation not found." });
            }
        })
        .catch((err) => res.status(500).json({ error: err }));
}

export function deleteParticipationAdmin(req, res) {
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    Participation.findOneAndDelete({ eventId: eventId, userId: userId })
        .then((participation) => {
            if (participation) {
                res.status(200).json({ message: "participation deleted successfully." });
            } else {
                res.status(404).json({ error: "participation not found." });
            }
        })
        .catch((err) => res.status(500).json({ error: err }));
}





