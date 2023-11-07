import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { errorHandler, notFoundError } from "./middlewares/error-handler.js";
import produitRoutes from "./routes/produit.js";

const app = express();
const PORT = process.env.PORT || 9090; // Corrected PORT assignment
const databaseName = 'AquaGuard';

// Displaying requests in the console
mongoose.set('debug', true);
// Setting the promise to work with microservices and connections
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((error) => {
    console.log(error);
  });
app.use(cors()); // Security
app.use(morgan('dev')); // Logging in the terminal
app.use(express.json()); // Parsing JSON
// Routes
app.use('/produit', produitRoutes);
app.use(notFoundError); // Handling 404 errors
app.use(errorHandler); // Handling 500 errors

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
