import User from '../models/user.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import multer from 'multer';

export function login(req, res) {
    const { username, password } = req.body;
    console.log("zae")
    console.log(username, password)
        // if (!(username && password)) {
        //     res.status(400).send("All input is required");
        // }
    if (validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        User.findOne({ username: username }).then(user => {

            if (user && (bcrypt.compareSync(password, user.password))) {
                const token = jwt.sign({ userId: user._id, username },
                    process.env.secret_token, {
                        expiresIn: "2h",
                    }
                );
                console.log("zaeaz")
                res.status(200).json({ user, token });
            }
            // } else
            //     res.status(400).json({ message: 'Invalid Credentials!' });
        })
    }


};

export function registerAndroidIOS(req, res) {
    const username = req.body.username;
    // console.log(req.file)
    // const image = req.file.filename;
    User.findOne({ username })
        .then(exists => {
            if (exists) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            return User.create({
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    isActivated: 1,
                    isBlocked: 0,
                    resetCode: 0,
                    nbPts: 0,
                    image: '../public/images/user/profile_pic.png',
                    role: "consommateur"
                })
                .then(user => {
                    res.status(201).json(user);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ message: err });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: err });
        });
};

export function registerFlutter(req, res) {
    const username = req.body.username;
    console.log(req.file)
    const image = req.file.filename;
    User.findOne({ username })
        .then(exists => {
            if (exists) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            return User.create({
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    isActivated: 1,
                    isBlocked: 0,
                    resetCode: 0,
                    nbPts: 0,
                    image: image,
                    role: "admin"
                })
                .then(user => {
                    res.status(201).json(user);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ message: err });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: err });
        });
};

export function getUsers(req, res) {
    User.find().then(user => {
        res.status(200).json({ status: '200', data: user });
    }).catch(err => {
        res.status(500).json({ status: '400', message: err })
    });
};

export function findUserById(req, res) {
    User.findById(req.body.id).then(user => {
        res.status(200).json({ data: user });
    }).catch(err => {
        res.status(500).json({ message: err })
    });
};

export function sendActivationCode(req, res) {
    try {
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.PASSWORD_EMAIL
            },
        });
        transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: req.body.email,
            subject: "Your Activation Code ✔",
            text: resetCode,
        });

        User.updateOne({
            email: req.body.email,
            resetCode: resetCode
        }).then(docs => {
            res.status(200).json({ email: req.body.email, resetCode });
        });
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
};

export async function verifyCode(req, res) {
    const { resetCode, email } = req.body;
    const user = await User.findOne({ email: email });

    if (resetCode == user.resetCode) {
        res.status(200).json({ message: 'true' });
    } else
        res.status(200).json({ message: 'false' });
};
export async function forgotPassword(req, res) {

    const { email, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (newPassword === confirmPassword) {
        var pass = bcrypt.hashSync(req.body.newPassword);

        var password = { password: pass };
        User.updateOne(user, password)
            .then(docs => {
                res.status(200).json({ data: req.body });
            })
            .catch(err => {
                res.status(500).json({ message: err })
            });
    } else
        res.status(500).json({ message: "2 passwords don't match" })
};