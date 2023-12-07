import User from '../models/user.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export function login(req, res) {
    const { username, password } = req.body;

    console.log(username, password)
    if (!(username && password)) {
        res.status(400).send("All input is required");
    }
    // if (validationResult(req).isEmpty()) {
    //     return res.status(400).json({ errors: validationResult(req).array() });
    // } else {
    User.findOne({ username: username }).then(user => {

        if (user && (bcrypt.compareSync(password, user.password))) {
            const token = jwt.sign({ userId: user._id, username },
                process.env.secret_token, {
                    expiresIn: "2h",
                }
            );

            res.status(200).json({ id: user._id, username: user.username, image: user.image, nbPts: user.nbPts, role: user.role, email: user.email, isActivated: user.isActivated, token });
        } else
            res.status(400).json({ message: 'Invalid Credentials!' });
    })

    //})

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
                    image: 'profile_pic.png',
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
                    role: "user"
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

export async function sendActivationCode(req, res) {
    try {
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        const email = req.body.email
        const user = await User.findOne({ email });
        const username = user.username;

        const htmlString = `
            <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
                <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                    <tr>
                        <td style='padding: 20px;'>
                            <h2 style='color: #333;'>Activation Code Email</h2>
                            <p>Dear ${username},</p>
                            <p>Your activation code is: <strong style='color: #009688;'>${resetCode}</strong></p>
                            <p>Please use this code to reset your password.</p>
                            <p>If you did not request this code, please disregard this email.</p>
                            <p>Thank you!</p>
                        </td>
                    </tr>
                </table>
            </body>
        `;
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
            html: htmlString,
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

export async function changePassword(req, res) {
    const { email, newPassword, confirmPassword, oldPassword } = req.body;

    const user = await User.findOne({ email: email })

    console.log(email, newPassword, confirmPassword, oldPassword)
    if (user && (bcrypt.compareSync(oldPassword, user.password))) {
        if (newPassword === confirmPassword) {

            user.password = bcrypt.hashSync(req.body.newPassword);
            await user.save();
            res.status(200).json({ data: req.body });
        } else
            res.status(200).json({ response: "passwords don't match" });
    } else
        res.status(500).json({ message: "email or password don't match" })
};

export async function deleteUser(req, res) {
    await User.findOneAndDelete({ email: req.params.email })
        .then(data => {
            return res.status(200).json({ message: "deleted" });
        })
        .catch(err => {
            return res.status(404).json({ message: 'user not found' });
        });
};

export async function updateProfile(req, res) {
    const username = req.params.username;

    const image = req.file.filename;
    await User.findOne({ username })
        .then(exists => {
            if (exists) {
                return User.updateOne({
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        image: image,
                    })
                    .then(user => {
                        res.status(201).json({
                            username: req.body.username,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            image: image,
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: err });
                    });
            } else {
                res.status(500).json({ message: "User does not exist" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: err });
        });
}