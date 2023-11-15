import  express  from "express";
import  mongoose  from "mongoose";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler,notFoundError } from "./middlewares/error-handler.js";
import eventRoutes from "./routes/event.js";
import actualiteroute from "./routes/actualite.js";


const app = express();
const PORT = 9090||process.env.PORT;
const databaseName = 'AquaGuard';

//affichages de requetes dans la console
mongoose.set('debug', true);

//promise bch ystenales microsevices y5dmou bch yconttecti
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`)
.then(() => {
    console.log(`connected to ${databaseName}`);
})
.catch((error) => {
    console.log(error);
});

app.use(express.urlencoded({ extended: true }));
//////////////////////////////////////
const __filename = fileURLToPath(import.meta.url); // Add this line
const __dirname = path.dirname(__filename); 
app.use(express.static(path.join(__dirname, 'public')));
////////////////////////////////////////////////////////////////



app.use(cors()); //security
app.use(morgan('dev')); //statut fel terminal 
app.use(express.json()); // bch yjm ya9ra json

//routes
app.use('/act',actualiteroute);
app.use('/event', eventRoutes);
app.use(notFoundError); // bch yjib erreur 404
app.use(errorHandler); // bch yjib erreur 500


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});