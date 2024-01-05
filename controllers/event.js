import Event from "../models/event.js";
import { validationResult } from "express-validator";
import Participation from "../models/participation.js";
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import User from '../models/user.js';
import nodemailer from 'nodemailer';


dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY2,
});

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
    Event.find({ hidden: false })
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
export async function deleteOne(req, res) {
    const eventId = req.params.id;

    try {
        // Delete all participations related to the event
        const deletedparticipants = await Participation.deleteMany({ "eventId": eventId });

        // Now, delete the event
        const deletedEvent = await Event.findOneAndDelete({ "_id": req.params.id });

        if (deletedEvent && deletedparticipants) {
            res.status(200).json({ message: "Event and associated participations deleted successfully!" });
        } else {
            res.status(404).json({ error: "Event not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



export function getAllEventsWithParticipations(req, res) {
    Event.find()
        .populate('userId', 'username role image')
        .then(async (events) => {
            const transformedEvents = await Promise.all(
                events.map(async (event) => {
                    console.log('Event ID:', event._id);
                    const participations = await Participation.find({ eventId: event._id })
                        .populate('userId', 'username image')
                        .select('userId');
                    console.log('Participations:', participations);


                    const participants = participations.map((participation) => {
                        return {
                            userId: participation.userId?._id,
                            username: participation.userId?.username ?? '',
                            image: participation.userId?.image ?? '',
                        };
                    });

                    console.log('Event ID:', event._id);
                    console.log('Participants:', participations);

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
                        hidden: event.hidden,
                        participants: participants,
                    };
                })
            );

            res.status(200).json(transformedEvents);
        })
        .catch((err) => {
            console.error('Error fetching events:', err);
            res.status(500).json({ error: err });
        });
}


export function getEventsNBParticipants(req, res) {
    Event.find()
        .sort({ createdAt: -1 }) // Sort events by date in descending order
        .limit(7) // Limit the result to 7 events
        .then(async (events) => {
            const transformedEvents = await Promise.all(
                events.map(async (event) => {
                    const participations = await Participation.find({ eventId: event._id })
                        .populate('userId', 'username image')
                        .select('userId');

                    const nbParticipants = participations.length; // Calculate the number of participants

                    return {
                        idEvent: event._id,
                        eventName: event.name,
                        nbParticipants: nbParticipants,
                    };
                })
            );

            res.status(200).json(transformedEvents);
        })
        .catch((err) => {
            console.error('Error fetching events:', err);
            res.status(500).json({ error: err });
        });
}


export async function addOnceByAdmin(req, res) {
    console.log(req.body);
    console.log(req.file);

    if (!validationResult(req).isEmpty()) {
        console.log({ errors: validationResult(req).array() })
        return res.status(400).json({ errors: validationResult(req).array() });
    }

    try {
        // Create the event
        const newEvent = await Event.create({
            userId: req.body.userId,
            name: req.body.name,
            DateDebut: req.body.DateDebut,
            DateFin: req.body.DateFin,
            Description: req.body.Description,
            lieu: req.body.lieu,
            image: req.file.filename,
        });

        // Fetch the user associated with the event
        const user = await User.findById(req.body.userId);
        const userEmail = user.email;

        // Send email with event information
        const emailHtml = `
        <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
                <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                    <tr>
                    <td style='padding: 20px;'>
                        <h2 style='color: #333;'>Event Added</h2>
                        <p>Dear ${user.firstName} ${user.lastName},</p>
                        <p>We are delighted to inform you that a new event has been added by our administration:</p>
                        <p><strong>Event Name:</strong> ${newEvent.name}</p>
                        <p><strong>Date Start:</strong> ${new Date(newEvent.DateDebut).toLocaleDateString()}</p>
                        <p><strong>Date End:</strong> ${new Date(newEvent.DateFin).toLocaleDateString()}</p>            
                        <p><strong>Description:</strong> ${newEvent.Description}</p>
                        <p><strong>Location:</strong> ${newEvent.lieu}</p>
                        <p>We appreciate you choosing our application to publish your events.</p>
                        <p>Best regards,</p>
                        <p>Aqua Guard</p>
                    </td>
                    </tr>
                </table>
        </body>

        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.PASSWORD_EMAIL,
            },
        });

        const mailOptions = {
            from: 'Aqua Guard',
            to: userEmail,
            subject: 'New Event Added',
            html: emailHtml,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).json("Event Added Successfully!");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const generateDescriptionWithChat = async (req, res) => {
    try {
        // Extract prompt from request. Assuming it's sent in the body under a key named 'prompt'
        const { prompt } = req.params; // from the params

        // Validate prompt
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `Provide a concise description for the following: "${prompt}"` } // Use the provided prompt
            ],
        });

        // Extract the completion message
        const completionMessage = chatCompletion.choices[0].message.content;

        console.log(`openai --------------------------${completionMessage}`);

        // Send the completion message as a response
        res.json({ description: completionMessage });
    } catch (error) {
        console.error('Error generating description with ChatGPT:', error);
        res.status(500).json({ error: 'Error generating description' });
    }
};





export function updateStatus(req, res) {
    const eventId = req.params.id;

    Event.findOne({ "_id": eventId })
        .then(async (event) => {
            if (!event) {
                return res.status(404).json({ error: "Event not found." });
            }

            // Toggle the 'hidden' field
            event.hidden = !event.hidden;

            // Save the updated event
            const updatedEvent = await event.save();

            // Send email notification based on the updated status
            if (event.hidden) {
                await sendHiddenEmail(updatedEvent);
            } else {
                await sendVisibleEmail(updatedEvent);
            }

            // Respond with the updated event
            res.status(200).json({ event: updatedEvent });
        })
        .catch((err) => res.status(500).json({ error: err.message }));
}


async function sendHiddenEmail(updatedEvent) {
    // Fetch the user associated with the event
    const user = await User.findById(updatedEvent.userId);
    const userEmail = user.email;

    // Send email with event information
    const emailHtml = `
 <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
         <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
             <tr>
             <td style='padding: 20px;'>
                 <h2 style='color: #333;'>Event Hidden</h2>
                 <p>Dear ${user.firstName} ${user.lastName},</p>
<p>We hope this message finds you well.</p>
<p>We regret to inform you that your event,<strong>${updatedEvent.name}</strong> , has been hidden by the administration.</p>
<p>This decision has been made by the administration for reasons that may include policy compliance or other considerations. If you have any concerns or inquiries regarding this update, please feel free to reach out to our support team.</p>
<p>We appreciate your understanding and cooperation in this matter.</p>
<p>Thank you for choosing our application to showcase your events.</p>
<p>Best regards,</p>
<p><strong>Aqua Guard Team</strong></p>

             </td>
             </tr>
         </table>
 </body>

 `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.PASSWORD_EMAIL,
        },
    });

    const mailOptions = {
        from: 'Aqua Guard',
        to: userEmail,
        subject: 'Event Hidden notification',
        html: emailHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });


}


async function sendVisibleEmail(updatedEvent) {
    // Fetch the user associated with the event
    const user = await User.findById(updatedEvent.userId);
    const userEmail = user.email;

    // Send email with event information
    const emailHtml = `
 <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
         <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
             <tr>
             <td style='padding: 20px;'>
                 <h2 style='color: #333;'>Event Visible</h2>
                 <p>Dear ${user.firstName} ${user.lastName},</p>
<p>We hope this message finds you well.</p>
<p>We are pleased to inform you that your event, <strong>${updatedEvent.name}</strong>, is now visible again on our application.</p>
<p>This decision has been reviewed, and your event is once again accessible to our audience. If you have any further questions or need additional assistance, please feel free to reach out to our support team.</p>
<p>We appreciate your understanding and cooperation in this matter.</p>
<p>Thank you for choosing our application to showcase your events.</p>
<p>Best regards,</p>
<p><strong>Aqua Guard Team</strong></p>


             </td>
             </tr>
         </table>
 </body>

 `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.PASSWORD_EMAIL,
        },
    });

    const mailOptions = {
        from: 'Aqua Guard',
        to: userEmail,
        subject: 'Event Visible notification',
        html: emailHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });


}


