import Actualite from '../models/actualite.js';
import Views from '../models/view.js';
import { param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();
const titlesToSearch = [];


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export function getAll(req, res) {
    const userId = req.user.userId;
    console.log(userId);
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
                    like: actualite.like,
                    dislike: actualite.dislike,
                };
            }));
            res.status(200).json(transformedevents);
        }).catch((err) => {
            res.status(500).json({ error: err.message });
        });
}

export function getOnce(req, res) {


    Actualite.findOne({ "_id": req.params.id })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
}


export function addOnce(req, res) {
    // const newid=Math.max(...games.map(game=>game.id))+1;
    console.log("adem");
    const userIdr = req.user.userId;
    console.log(userIdr);
    const act = new Actualite({
        userId: userIdr,
        title: req.body.title,
        description: req.body.desc,
        image: req.file.filename,
        text: req.body.text,
        views: 0
    });
    act
        .save()
        .then(newact => {
            res.json(newact);
        })
        .catch(err => {
            res.json({ Error: err })
        });

}
export async function searchActualites(req, res) {
    try {
        console.log('Request body==============---------------------------=================:', req.body);

        console.log(`about req ///////////////////////////////////////////////////////${req.body.about}`);
        const actualites = await Actualite.find();
        const transformedEvents = actualites.map(actualite => {
            return `title: ${actualite.title}, text: ${actualite.text}`;
        });

        const resultString = transformedEvents; // Joining the array with newline

        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: `je vais vous donner les titre suivie par son text et vous me donner (seulement) les titre des text dons parle de :( ${req.body.about} )et si vous trouver plusieur separe les avec (,) ${resultString} ... NB :donner seulement les titre des text` }],
            model: "gpt-4",
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
                like: actualite.like,
                dislike: actualite.dislike,
                
            };
        }));

        res.status(200).json(transformedevents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export async function addview(req, res) {
    const userId = req.user.userId;

    var actualiteId = req.params.actualiteId;

    const comment = ""
    const like = 0
    var newview = new Views({ userId, actualiteId, like, comment })
    const existingAvis = await Views.findOne({ userId, actualiteId });
    if (existingAvis == null) {
        console.log("---------------------bech nsajjel taw ")
        newview
            .save()
        const actualite = await Actualite.findById(actualiteId)
        actualite.views += 1
        await actualite.save()
            .then((newview) => res.status(200).json(newview))

            .catch(err => {
                res.json({ Error: err })
            });
        console.log("---------------------ok ")

    } else res.status(200).json({ message: "allrady viewd" });


}




export async function addorchangelike(req, res) {
    const userId = req.user.userId;
    const actualiteId = req.params.actualiteId;
    const like = req.params.like;
    var comteurreviews = 0;
    var popularite = "";
    var userlikeaction = 0;

    try {


        const actualite = await Actualite.findById(actualiteId);
        const existingAvis = await Views.findOne({ userId, actualiteId });
        console.log(existingAvis.like);
        console.log("====================================");

        if (like == 1) {
            if (existingAvis.like == 0) {//tzid like
                console.log("tzid like")
                existingAvis.like = 1
                userlikeaction = 1
                actualite.like = actualite.like + 1
            } else if (existingAvis.like == 1) {// tna77i like
                console.log(" tna77i like")
                existingAvis.like = 0
                userlikeaction = 0
                existingAvis.comment = ""
                actualite.like = actualite.like - 1
            } else if (existingAvis.like == 2) {//tbadel men dislike l'like
                console.log("tbadel men dislike l'like")
                actualite.like = actualite.like + 1
                actualite.dislike = actualite.dislike - 1
                existingAvis.like = 1
                existingAvis.comment = ""
                userlikeaction = 1
            }
        } else if (like == 2) {
            if (existingAvis.like == 0) {//tzid dislike
                console.log("tzid dislike")
                actualite.dislike = actualite.dislike + 1
                existingAvis.like = 2
                userlikeaction = 2
            } else if (existingAvis.like == 1) {//tbadel men like ldislike
                console.log("tbadel men like ldislike")
                actualite.dislike = actualite.dislike + 1
                existingAvis.comment = ""
                actualite.like = actualite.like - 1
                existingAvis.like = 2
                userlikeaction = 2
            } else if (existingAvis.like == 2) { // tna77i dislike
                console.log("tna77i dislike");
                actualite.dislike = actualite.dislike - 1
                existingAvis.comment = ""
                existingAvis.like = 0
                userlikeaction = 0
            }
        }
        await existingAvis.save();
        await actualite.save();
        if (userlikeaction == 1) {
            await Views.find({ "actualiteId": { $in: actualiteId } })
                .then(async reviews => {
                    const transformedreviews = await Promise.all(reviews.map(async review => {
                        if (review.like === 1) {
                            comteurreviews += 1;
                        }

                    }));
                }).catch((err) => {
                    console.log("error")
                });
            // comteurreviews-=1;


            console.log(comteurreviews)
        } else if (userlikeaction == 2) {
            await Views.find({ "actualiteId": { $in: actualiteId } })
                .then(async reviews => {
                    const transformedreviews = await Promise.all(reviews.map(async review => {
                        if (review.like === 2) {
                            comteurreviews += 1;
                        }
                    }));
                }).catch((err) => {
                    console.log("error")
                });



            console.log(comteurreviews)

        }
        res.status(200).json(comteurreviews);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
}


export async function getliketable(req, res) {


    const userId = req.user.userId;
    console.log(userId);
    const actualiteId = req.params.actualiteId;

    Views.findOne({ userId, actualiteId })
        .then((views) => {
            if (views) {
                res.status(200).json(views);
            } else {
                res.status(404).json({ error: "not found." });

            }
        })
        .catch((err) => res.status(500).json({ error: err.message }));

}




export async function addreview(req, res) {
    const userId = req.user.userId;
    const actualiteId = req.params.actualiteId;
    const commenter = req.params.review;


    try {

        const existingAvis = await Views.findOne({ userId, actualiteId });
        console.log(existingAvis.comment);
        console.log("====================================");
        existingAvis.comment = commenter;
        await existingAvis.save();



        res.status(200).json({ message: "Operation successful" });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
}



