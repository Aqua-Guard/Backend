import Commande from "../models/commande.js";
export function addOnce(req, res) {
    Commande.create({
        totalpoints : req.body.totalpoints
    })
        .then((newCommande) => res.status(201).json({Commande: newCommande}));
}