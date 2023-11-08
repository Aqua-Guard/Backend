import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import { errorHandler, notFoundError } from "./middlewares/error-handler.js";
import eventRoutes from "./routes/event.js";
import participationRoutes from "./routes/participation.js";
import produitRoutes from "./routes/produit.js";
import commandeRoutes from "./routes/commande.js";
import panierRoutes from "./routes/panier.js";



const app = express();
const PORT = process.env.PORT || 9090;
const databaseName = 'AquaGuard';


mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`)
    .then(() => {
        console.log(`Connected to ${databaseName}`);
    })
    .catch((error) => {
        console.log(error);
    });


// Middlewares
app.use(cors()); // Security
app.use(morgan('dev')); // Logging in the terminal
app.use(express.json()); // Parsing JSON


//routes
app.use('/events', eventRoutes);//Event routes
app.use('/participations', participationRoutes);//Participation routes
app.use('/produit', produitRoutes);
app.use('/commande', commandeRoutes);
app.use('/panier', panierRoutes);
app.use(notFoundError); // Handling 404 errors
app.use(errorHandler); // Handling 500 errors



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
