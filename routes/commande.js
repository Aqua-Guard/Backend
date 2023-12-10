/*import express from "express";
import Commande from "../models/commande.js";
import Produit from"../models/produit.js";
import stripe from "stripe";
import nodemailer from 'nodemailer';
import { deleteCommandeById } from '../controllers/commande.js';
//import { authenticateUser } from "../middlewares/authMiddleware.js";
/*import {
  getAllUsers,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/user.js";*/


/*const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arafetksiksi7@gmail.com', // replace with your email
    pass: 'klsa cxrc jgda utiv', // replace with your email password
  },
});
const router = express.Router();
const stripeSecretKey = 'sk_test_51ODOR4KuYIHrh7zw51qwhgS8oDwJcwWbq4Sqe1BA7oFNhf51Es6AuXUPO3VZLDvl2PYzkGQfybGWWjfGKwn6VdxP00A27LizGQ';
const stripeClient = stripe(stripeSecretKey);

// Create a new "commande"
// Create a new "commande"
router.post('/', async (req, res) => {
  const userId = "arafet"
  try {
    const { selectedProducts } = req.body;

    // Calculate the total price based on the products in selectedProducts
    const totalPrice = selectedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    const newCommande = new Commande({ selectedProducts, totalPrice, userId });
    const savedCommande = await newCommande.save();
    res.status(201).json(savedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.post('/add-products', async (req, res) => {
  try {
    const userId = '654e0094cbe34d1a1ddb2e56';
    const produitId = req.query.produitId;

    let commande = await Commande.findOne({ userId });

    if (!commande) {
      const newCommande = new Commande({ userId, selectedProducts: [], totalPrice: 0 });
      commande = await newCommande.save();
    }

    const existingProductIndex = commande.selectedProducts.findIndex(
      (selectedProduct) => selectedProduct.produit.toString() === produitId
    );

    if (existingProductIndex !== -1) {
      commande.selectedProducts[existingProductIndex].quantity += 1;
    } else {
      const produit = await Produit.findById(produitId);

      if (!produit) {
        return res.status(404).json({ error: 'Product not found' });
      }

      commande.selectedProducts.push({
        produit,
        quantity: 1,
        title: produit.title,
        price: produit.price,
        image: produit.image,
      });
    }

    const totalPrice = commande.selectedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    commande.totalPrice = totalPrice;

    const updatedCommande = await commande.save();
    res.json(updatedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




router.delete('/delete-product', async (req, res) => {
  try {
    const userId = "655f7a41e7c5d11f0bd76ea0";
    const produitId = req.query.produitId;

    let commande = await Commande.findOne({ userId });

    if (!commande) {
      return res.status(404).json({ error: 'Command not found' });
    }

    const productIndex = commande.selectedProducts.findIndex(
      (selectedProduct) => selectedProduct.produit.toString() === produitId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in the command' });
    }

    const removedProductPrice = commande.selectedProducts[productIndex].price;

    commande.selectedProducts.splice(productIndex, 1);

    const newTotalPrice = commande.selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    commande.totalPrice = newTotalPrice;

    const updatedCommande = await commande.save();

    res.json(updatedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




router.get('/cart', async (req, res) => {
  try {
    const userId = "655f7a41e7c5d11f0bd76ea0";

    const commande = await Commande.findOne({ userId });

    if (!commande) {
      return res.status(404).json({ error: 'Commande not found' });
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/create-payment-intent', async (req, res) => {
  try {
    const userId = "655f7a41e7c5d11f0bd76ea0";

    // Retrieve the existing command for the user
    const commande = await Commande.findOne({ userId });

    if (!commande) {
      return res.status(404).json({ error: 'Commande not found' });
    }

    const totalPrice = commande.selectedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: totalPrice * 100, 
      currency: 'eur',
      payment_method_types: ['card'],
    });

   
    const mailOptions = {
      from: 'arafetksiksi7@gmail.com', 
      to: 'arafet.ksiksi@esprit.tn', 
      subject: 'Payment Receipt',
      text: `Thank you for your purchase!\n\nCart Details:\n\n${formatCartDetails(commande.selectedProducts)}\nTotal Price: ${totalPrice} TND`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
         deleteCommandeById(commande._id);

        console.log('Email sent:', info.response);
        
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error sending email:', error);

    res.status(500).json({ error: error.message });
  }
});


function formatCartDetails(selectedProducts) {
  return selectedProducts.map((product) => {
    return `${product.title}: ${product.quantity} x ${product.price} TND`;
  }).join('\n');
}








export default router;*/
