import Actualite from '../models/actualite.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose'; 
export function getAll(req,res){
Actualite.find()
.then(async actualites => {
    const transformedevents = await Promise.all(actualites.map(async actualite => {
        return {
            idactualite: actualite._id,
            userId: actualite.userId,
            title: actualite.title,
            description: actualite.description,
            image: actualite.image,
            text: actualite.text,
            views: actualite.views,
        };
    }));
    res.status(200).json(transformedevents);
}) .catch((err) => {
    res.status(500).json({ error: err.message });
});
}
export function getOnce(req, res) {
    Actualite.find({"title":req.params.name})
    .then(doc=>{
        res.status(200).json(doc);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
    }


    export function  addOnce(req,res){
        // const newid=Math.max(...games.map(game=>game.id))+1;
     
        const act = new Actualite({
            userId: new mongoose.Types.ObjectId(req.body.userId),
            title: req.body.title,
            description: req.body.desc,
            image: req.file.filename,  
            text: req.body.text,
            views: 0
            });
    act 
    .save()
        .then(newact =>{
            res.json(newact);
        })
        .catch(err=>{
            res.json({Error:err})
        });
    
    }