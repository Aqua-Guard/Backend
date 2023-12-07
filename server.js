import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import dotenv from 'dotenv';
import actualiteroute from "./routes/actualite.js";
import { errorHandler, notFoundError } from "./middlewares/error-handler.js";
import eventRoutes from "./routes/event.js";
import participationRoutes from "./routes/participation.js";
import produitRoutes from "./routes/produit.js";
import commandeRoutes from "./routes/commande.js";
import panierRoutes from "./routes/panier.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import likeRoutes from "./routes/like.js";
import { authenticateToken } from "./middlewares/user-auth-middleware.js";
import avisroute from "./routes/avis.js";
import favproduitRoutes from './routes/FavProduit.js'




dotenv.config();

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

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

//routes

app.use('/user', userRoute);

app.use('/events',  authenticateToken, eventRoutes); //Event routes
app.use('/posts', authenticateToken, postRoutes); //Post routes
app.use('/like',authenticateToken, likeRoutes); //Like routes
app.use('/comments', authenticateToken, commentRoutes); //Comment routes
app.use('/participations', authenticateToken, participationRoutes); //Participation routes
app.use('/produit', produitRoutes);
app.use('/commande', commandeRoutes);
app.use('/act',actualiteroute);//actualite routes
app.use('/avis',avisroute); // avis routes
app.use('/event', eventRoutes);
app.use('/produit', produitRoutes);
app.use('/commande', commandeRoutes);
app.use('/favproduit', favproduitRoutes);
app.use(notFoundError); // Handling 404 errors
app.use(errorHandler); // Handling 500 errors



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});