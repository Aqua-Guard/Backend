import Discution from '../models/discution.js';








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

export function getAllMessages(req, res) {
    const reclamationId = req.body.reclamationId;

    Discution.find({ reclamationId })
        .then (async messages => {
            const transformeddiscution = await Promise.all(messages.map(async messages => {
            return {
                idreclamation: messages.reclamationId,
                message: messages.message,
                userRole: messages.userRole,
                createdAt: messages.createdAt,

            };
        }));
        res.status(200).json(transformeddiscution);
        })
        .catch(err => {
            res.json({ Error: err });
        });
}


    export function sendMessage(req,res){

        const discus = new Discution({
            reclamationId: req.body.reclamationId,
            userRole: req.body.userRole,
            message: req.body.message,   
            });
            if (req.file) {
                discus.image = req.file.filename;
            }
            discus 
        .save()
        .then(newdiscus =>{
            res.json(newdiscus);
        })
        .catch(err=>{
            res.json({Error:err})
        });
    
    }



        
