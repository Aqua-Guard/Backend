import Participation from "../models/participation.js";
import User from '../models/user.js';
import Event from '../models/event.js';
import nodemailer from 'nodemailer';


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

        res.status(201).json({ message: "participation added succesfully!" });
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
        res.status(200).json(!!participation);
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

export async function deleteParticipationAdmin(req, res) {
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    try {
        const participation = await Participation.findOneAndDelete({ eventId, userId });

        if (participation) {
            const event = await Event.findById(eventId);
            // Notify the user via email
            const user = await User.findOne({ _id: userId });

            if (user) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.SENDER_EMAIL,
                        pass: process.env.PASSWORD_EMAIL,
                    },
                });

                const htmlString = `
            <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
                <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                    <tr>
                        <td style='padding: 20px;'>
                            <h2 style='color: #333;'>Participation Deleted</h2>
                            <p>Dear ${user.firstName} ${user.lastName},</p>
                            <p>We regret to inform you that your participation in the event "${event.name}" from ${new Date(event.DateDebut).toLocaleDateString()} to ${new Date(event.DateFin).toLocaleDateString()} has been deleted by our administration.</p>
                            <p>If you have any questions or concerns, please contact us.</p>
                            <p>Thank you for your understanding.</p>
                            <p>Best regards,</p>
                            <p>Aqua Guard</p>
                        </td>
                    </tr>
                </table>
            </body>
          `;

                await transporter.sendMail({
                    from: process.env.SENDER_EMAIL,
                    to: user.email,
                    subject: 'Participation Deleted Notification',
                    html: htmlString,
                });
            }

            res.status(200).json({ message: 'Participation deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Participation not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




