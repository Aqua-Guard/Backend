import Actualite from '../models/actualite.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose'; 
export function getAll(req,res){
    Actualite.find({})
    .then(docs=>{
        res.json(docs);
    })
    .catch(err=>{
        res.json({error:err});
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
    export function addOnce(req,res){
        // const newid=Math.max(...games.map(game=>game.id))+1;
     
        const act = new Actualite({
            userId: new mongoose.Types.ObjectId(req.body.userId),
            title: req.body.title,
            description: req.body.desc,
            image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
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