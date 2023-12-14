import discution from '../models/discution.js';
import Reclamation from '../models/reclamation.js';

import mongoose from 'mongoose'; 






export function getAll(req,res){
Reclamation.find()
.then(async reclamations => {
    const transformedreclamation = await Promise.all(reclamations.map(async reclamation => {
        return {
            idactualite: reclamation.title,
            userId: reclamation.userId,
     
        };
    }));
    res.status(200).json(transformedreclamation);
}) .catch((err) => {
    res.status(500).json({ error: err.message });
});
}




    export function  addOnce(req,res){


        const rec = new Reclamation({
            userId: new mongoose.Types.ObjectId(req.body.userId),
            title: req.body.title,
            description: req.body.desc,
            image: req.file.filename,  
            });
         rec 
        .save()
        .then(newrec =>{
            res.json(newrec);
        })
        .catch(err=>{
            res.json({Error:err})
        });
        const discus = new discution({
            reclamationId: rec._id,
            userRole: "user",
            message: rec.description,   
            });
        
            discus 
        .save()

    
    }
    