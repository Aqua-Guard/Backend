import Actualite from '../models/actualite.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose'; 
import { OpenAI} from 'openai';
import dotenv from 'dotenv';
dotenv.config();
const titlesToSearch = [];


const openai =new OpenAI({
  apiKey : process.env.OPENAI_API_KEY,
});
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
    
    
    Actualite.find({"title":{ $in: titlesToSearch }})
    .then(doc=>{
        res.status(200).json(doc);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
    }


    export function  addOnce(req,res){
        // const newid=Math.max(...games.map(game=>game.id))+1;
        console.log("adem");

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
    export async function searchActualites(req, res) {
        try {
            console.log(`about req ///////////////////////////////////////////////////////${req.body.about}`);
            const actualites = await Actualite.find();
            const transformedEvents = actualites.map(actualite => {
                return `title: ${actualite.title}, text: ${actualite.text}`;
            });
    
            const resultString = transformedEvents; // Joining the array with newline
    
            const chatCompletion = await openai.chat.completions.create({
                messages: [{ role: "user", content: `je vais vous donner les titre suivie par son text et vous me donner (seulement) les titre des text dons parle de :( ${req.body.about} )et si vous trouver plusieur separe les avec (,) ${resultString} ... NB :donner seulement les titre des text` }],
                model: "gpt-3.5-turbo",
            });
    
            console.log(`openai --------------------------${chatCompletion.choices[0].message.content}`);
            const additionalNamesArray = chatCompletion.choices[0].message.content.split(',').map(name => name.trim());
            titlesToSearch.push(...additionalNamesArray);
            console.log(`le tableux ------------------------------${titlesToSearch}`);
    
            const searchedActualites = await Actualite.find({ "title": { $in: titlesToSearch } });
            const transformedevents = await Promise.all(searchedActualites.map(async actualite => {
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
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
      }
