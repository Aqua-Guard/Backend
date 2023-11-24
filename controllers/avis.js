import Avis from '../models/avis.js';
import mongoose from 'mongoose'; 




//getall avis methode 
export function getAllavis(req,res){
    Avis.find()
.then(async avis => {
    const transformedevents = await Promise.all(avis.map(async avis => {
        return {
            userId: avis.userId,
            actualiteTitle: avis.actualiteTitle,
            avis: avis.avis,
        };
    }));
    res.status(200).json(transformedevents);
}) .catch((err) => {
    res.status(500).json({ error: err.message });
});
}


////// ajouter une avis
    export function  addOnceAvis(req,res){
        // const newid=Math.max(...games.map(game=>game.id))+1;
     
        const avis = new Avis({
            userId: req.body.userId,
            actualiteTitle: req.body.actualiteTitle,
            avis: req.body.avis,
            });
            avis 
    .save()
        .then(newavis =>{
            res.json(newavis);
        })
        .catch(err=>{
            res.json({Error:err})
        });
    
    }
    export function getOncebi(req, res) {
        const { iduser, idactualite } = req.params;
    
        Avis.findOne({ "actualiteTitle": idactualite, "userId": iduser })
            .then(doc => {
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({ message: "Avis not found" });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    }


    
    export async function addOrUpdateAvis(req, res) {
        const { userId, actualiteTitle, avis } = req.body;
    
        try {
            const existingAvis = await Avis.findOne({ userId, actualiteTitle });
    
            if (existingAvis) {
                // Update existing Avis
                await Avis.updateOne({ userId, actualiteTitle }, { avis });
                res.status(200).json({ message: 'Avis updated successfully' });
            } else {
                // Add new Avis
                const newAvis = new Avis({ userId, actualiteTitle, avis });
                await newAvis.save();
                res.status(201).json({ message: 'Avis added successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    