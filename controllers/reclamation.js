import discution from '../models/discution.js';
import Reclamation from '../models/reclamation.js';
import mongoose from 'mongoose'; 





//this methode is used to the administrator 
export function getAll(req,res){
Reclamation.find()
.then(async reclamations => {
    const transformedreclamation = await Promise.all(reclamations.map(async reclamation => {

        return {
            idreclamation: reclamation._id,
            userId: reclamation.userId,
            title: reclamation.title,
            image: reclamation.image,
            date: reclamation.createdAt,
            description:reclamation.description,
        };
    }));
    res.status(200).json(transformedreclamation);
}) .catch((err) => {
    res.status(500).json({ error: err.message });
});
}


//get al reclamation by user id
export function getAllByUserId(req, res) {
    const userId = req.user.userId;
    Reclamation.find({"userId":{ $in:userId }})
        .then(async reclamations => {
            const transformedReclamations = await Promise.all(reclamations.map(async reclamation => {
                return {
                    idreclamation: reclamation._id,
                    userId: reclamation.userId,
                    title: reclamation.title,
                    image: reclamation.image,
                    date: reclamation.createdAt,
                    description: reclamation.description,
                    answered: reclamation.answered
                };
            }));
            res.status(200).json(transformedReclamations);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
}





    export function  addOnce(req,res){
        const userIdr = req.user.userId;
console.log(req.body);
        const rec = new Reclamation({
            userId: userIdr,
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
    