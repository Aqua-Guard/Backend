import User from '../models/user.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export function login(req, res) {
    const { username, password } = req.body;

    console.log(username, password)
    if (!(username && password)) {
        res.status(400).send("All input is required");
    }
    User.findOne({ username: username }).then(user => {

        if (user && (bcrypt.compareSync(password, user.password))) {
            const token = jwt.sign({ userId: user._id, username },
                process.env.secret_token, {
                    expiresIn: "2h",
                }
            );
            res.status(200).json({ user, token });
        } else
            res.status(400).json({ message: 'Invalid Credentials!' });
    })

};

export function register(req, res) {
    const username = req.body.username;
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
                    image: image
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