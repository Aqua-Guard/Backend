import Event from "../models/event.js";
export function addOnce(req, res) {
    Event.create({
        name: req.body.name,
        
    })
        .then((newEvent) => res.status(201).json({event: newEvent}));
}