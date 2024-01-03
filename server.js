
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import dotenv from 'dotenv';
import reclamationRoutes from "./routes/reclamation.js";
import discutionRoutes from "./routes/discution.js";
import { errorHandler, notFoundError } from "./middlewares/error-handler.js";
import eventRoutes from "./routes/event.js";
import participationRoutes from "./routes/participation.js";
import produitRoutes from "./routes/produit.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import likeRoutes from "./routes/like.js";
import actualiteroute from "./routes/actualite.js";
import commandeRoutes from "./routes/commande.js";
import { authenticateToken } from "./middlewares/user-auth-middleware.js";
import avisroute from "./routes/avis.js";
import { Server as SocketIOServer } from "socket.io";
import http from 'http';

dotenv.config();
const app = express();
const server = http.createServer(app); // Use the http module to create a server
const io = new SocketIOServer(server);  

const PORT = process.env.PORT || 9090;

const databaseName = 'AquaGuard';

const db_url_atlas = process.env.DB_URL_ATLAS || 'mongodb+srv://topadmin:topadmin@cluster0.8m1dzlk.mongodb.net/?retryWrites=true&w=majority'

mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`)
//mongoose.connect(db_url_atlas)// to decommente this later 
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
app.use('/act',authenticateToken,actualiteroute);//actualite routes
app.use('/reclamation',authenticateToken,reclamationRoutes);//reclaation routes
app.use('/discution',discutionRoutes);//discution routes
app.use('/avis',avisroute); // avis routes
app.use('/event', eventRoutes);
app.use('/produit', produitRoutes);
app.use(notFoundError); // Handling 404 errors
app.use(errorHandler); // Handling 500 errors




// You can set up Socket.IO event handlers here
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
io.on('connection', (socket) => {
    console.log('A user connected');
   
});
