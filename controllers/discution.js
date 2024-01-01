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
    const { reclamationId } = req.params;
const visibility=true;
    Discution.find({ reclamationId,visibility })
        .then (async messages => { 
            const transformeddiscution = await Promise.all(messages.map(async messages => {
             
            return {
                idmessage: messages._id,
                idreclamation: messages.reclamationId,
                message: messages.message,
                userRole: messages.userRole,
                createdAt:messages.createdAt,
                visibility: messages.visibility,

            };
        }));
        res.status(200).json(transformeddiscution);
        })
        .catch(err => {
            res.json({ Error: err });
        });
}

//send message methode for android and ios 
    export function sendMessage(req,res){
        const userRole = "user";
        const discus = new Discution({
            reclamationId: req.body.reclamationId,
            userRole: userRole,
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

//delete message methode for android and ios (in case delete for all )
export async function deletemessageforall(req,res){
  
    try {

        const deletedmessage = await Discution.findOneAndDelete({ "_id": req.params.id });

        if (deletedmessage ) {
            res.status(200).json({ message: "message has been deleted successfully!" });
        } else {
            res.status(404).json({ error: "message not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//delete message methode for android and ios (in case delete only for the user )
export async function deletemessageonlyforuser(req,res){
    const updatedFields = {
        visibility: false
    };
    Discution.findOneAndUpdate({ "_id": req.params.id }, updatedFields, { new: true })
    .then((updatedmessage) => {
        if (updatedmessage) {
            res.status(200).json("OK");
        } else {
            res.status(404).json({ error: "message not found." });
        }
    })
    .catch((err) => res.status(500).json({ error: err.message }));

}


        






export async function deleteallllllllllmessage(req,res){
  
    try {

        const deletedmessage = await Discution.findOneAndDelete({ "userRole": "consmateur"});

        if (deletedmessage ) {
            res.status(200).json({ message: "message has been deleted successfully!" });
        } else {
            res.status(404).json({ error: "message not found." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}




//send message methode for flutter
export function sendMessageadmin(req,res){
    const userRole = "admin";
    const discus = new Discution({
        reclamationId: req.body.reclamationId,
        userRole: userRole,
        message: req.body.message,   
        });

        discus 
    .save()
    .then(newdiscus =>{
        res.json(newdiscus);
    })
    .catch(err=>{
        res.json({Error:err})
    });

}