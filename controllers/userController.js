import User from '../models/user.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

export function login(req, res) {
    const { username, password } = req.body;

    console.log(username, password)
    if (!(username && password)) {
        res.status(500).send("All input is required");
    } else {
        User.findOne({ username: username }).then(user => {

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.isBlocked) {
                return res.status(402).json({ bannedUntil: user.bannedUntil });
            }

            if (user && (bcrypt.compareSync(password, user.password))) {
                const token = jwt.sign({ userId: user._id, username },
                    process.env.secret_token, {
                        expiresIn: "2h",
                    }
                );
                user.isActivated = 1;

                user.save();
                res.status(200).json({ id: user._id, username: user.username, image: user.image, nbPts: user.nbPts, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email, isActivated: user.isActivated, token });
            } else
                res.status(400).json({ message: 'Invalid Credentials!' });
        })
    }
};

export function loginFlutter(req, res) {
    const { username, password } = req.body;

    console.log(username, password)
    if (!(username && password)) {
        res.status(500).send("All input is required");
    } else {
        User.findOne({ username: username }).then(user => {

            if (user && (bcrypt.compareSync(password, user.password))) {

                if (user.role === "admin") {
                    const token = jwt.sign({ userId: user._id, username },
                        process.env.secret_token, {
                            expiresIn: "2h",
                        }
                    );
                    user.isActivated = 1;

                    user.save();
                    res.status(200).json({ id: user._id, username: user.username, image: user.image, nbPts: user.nbPts, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email, isActivated: user.isActivated, token });
                } else {
                    res.status(403).json({ message: 'Access Denied. Only admin can login.' });
                }
            } else {
                res.status(400).json({ message: 'Invalid Credentials!' });
            }
        })
    }
};

export function registerAndroidIOS(req, res) {
    const username = req.body.username

    User.findOne({ username })
        .then(exists => {
            if (exists) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            return User.create({
                    username: username,
                    password: bcrypt.hashSync(req.body.password),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    isActivated: 1,
                    isBlocked: 0,
                    resetCode: 0,
                    nbPts: 0,
                    image: req.file ? req.file.filename : null,
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
    const { id } = req.params;

    User.find({ _id: { $ne: id } })
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
}

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
        console.log(email)

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
    console.log(resetCode)

    if (!user) {
        res.status(404).json({ message: 'User not found' });
    } else if (resetCode === null || resetCode === undefined) {
        res.status(400).json({ message: 'resetCode is null or undefined' });
    } else if (resetCode == user.resetCode) {
        res.status(200).json({ message: 'true' });
    } else {
        res.status(400).json({ message: 'false' });
    }
}

export async function forgotPassword(req, res) {

    const { email, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (newPassword == "" || confirmPassword == "")
        res.status(500).json({ message: "fields empty" });

    else if (newPassword === confirmPassword) {
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
            res.status(400).json({ response: "passwords don't match" });
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

export async function deleteUserById(req, res) {
    console.log(req.params.id)
    await User.findOneAndDelete({ id: req.params.id })
        .then(data => {
            return res.status(200).json({ message: "deleted" });
        })
        .catch(err => {
            return res.status(404).json({ message: 'user not found' });
        });
};

export async function updateProfile(req, res) {
    const id = req.params.id;
    console.log(req.body)
    console.log(req.headers['content-type']);
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }
    await User.findOne({ "_id": id })
        .then(exists => {
            if (exists) {
                return User.findOneAndUpdate({ "_id": id }, {
                        username: req.body.newUsername,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        image: req.file.filename,
                    }, { new: true })
                    .then(user => {
                        res.status(200).json({ username: user.username, image: user.image, firstName: user.firstName, lastName: user.lastName, email: user.email });

                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: err.message || 'Internal server error' });
                    });
            } else {
                res.status(404).json({ message: 'User does not exist' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: err.message || 'Internal server error' });
        });
}

export function getPartenaires(req, res) {
    User.find({ role: "partenaire" })
        .then(users => {
            if (users.length === 0) {
                return res.status(404).json({ message: 'No users found with the specified role' });
            }
            const transformedUsers = users.map(user => {
                return {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            });

            res.status(200).json(transformedUsers);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
}

export async function desactivateAccount(req, res) {
    const id = req.params.id;

    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.isActivated = 0;
            return user.save();
        })
        .then(() => {
            return res.status(200).json({ message: 'Deactivated' });
        })
        .catch(err => {
            return res.status(500).json({ message: 'Internal Server Error' });
        });
}

export async function googleSignIn(req, res) {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const username = req.body.username

    const token = req.body.idToken;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();

        User.findOne({ username })
            .then(exists => {
                if (exists) {
                    return res.status(400).json({ message: 'Username already exists' });
                }
                return User.create({
                        username: username,
                        password: bcrypt.hashSync("0000"),
                        firstName: payload.given_name,
                        lastName: payload.family_name,
                        email: payload.email,
                        isActivated: 1,
                        isBlocked: 0,
                        resetCode: 0,
                        nbPts: 0,
                        image: "default_pic.png",
                        role: "consommateur"
                    })
                    .then(user => {
                        res.status(201).json({ id: user._id, username: user.username, image: user.image, nbPts: user.nbPts, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email, isActivated: user.isActivated, token });
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

    } catch (error) {
        res.status(401).json({ error: 'Token verification failed' });
    }
}

export async function completeGoogleSignin(req, res) {
    const id = req.params.id;
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }
    await User.findOne({ "_id": id })
        .then(exists => {
            if (exists) {
                return User.findOneAndUpdate({ "_id": id }, {
                        password: bcrypt.hashSync(req.body.password),
                        image: req.file.filename,
                    }, { new: true })
                    .then(user => {
                        res.status(200).json({ image: user.image });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: err.message || 'Internal server error' });
                    });
            } else {
                res.status(404).json({ message: 'User does not exist' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: err.message || 'Internal server error' });
        });
}

export async function banUser(req, res) {
    const id = req.params.id;
    const currentDate = new Date();
    const bannedUntil = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    try {
        const user = await User.findByIdAndUpdate(
            id, { bannedUntil: bannedUntil, isBlocked: true }, { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        setTimeout(async() => {
            user.isBlocked = false;
            await user.save();
        }, bannedUntil - currentDate);

        return res.status(200).json({ message: 'User blocked successfully', bannedUntil: user.bannedUntil });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}