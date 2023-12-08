import discution from '../models/discution.js';
import Reclamation from '../models/reclamation.js';

import mongoose from 'mongoose'; 






// export function getAll(req,res){
// Actualite.find()
// .then(async actualites => {
//     const transformedevents = await Promise.all(actualites.map(async actualite => {
//         return {
//             idactualite: actualite._id,
//             userId: actualite.userId,
//             title: actualite.title,
//             description: actualite.description,
//             image: actualite.image,
//             text: actualite.text,
//             views: actualite.views,
//         };
//     }));
//     res.status(200).json(transformedevents);
// }) .catch((err) => {
//     res.status(500).json({ error: err.message });
// });
// }




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
    