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
            userId: new mongoose.Types.ObjectId(req.body.userId),
            actualiteTitle: new mongoose.Types.ObjectId(req.body.actualiteTitle),
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