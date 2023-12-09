const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User'); // Import the User model

const user = {
    username: 'test-user',
    passwordHash: 'bcrypt-hashed-password',
    id: 1
}

function findUser(username, callback) {
    User.findOne({$or: [
        { username },
        { email: username },
    ]}, callback)
}


async function registerUser(email, password, name, callback) {

    // Check if the user already exists and has a password
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.passwordHash !== null) {
        return callback('User already exists');
    }

    // Hash the password

    // Create a new user instance and save it to the database
    if (existingUser) {
        await existingUser.setPassword(password);
        existingUser.name = name;
        await existingUser.save();
        return callback(null, existingUser);
    }
    else {
        const newUser = new User({ username: email, email: email, role: 'registered', name });
        await newUser.setPassword(password);
        await newUser.save();
        callback(null, newUser);
    }

}

passport.use(new LocalStrategy(
    (username, password, done) => {

        findUser(username, async (err, user) => {
            if (err) {
                return done(err)
            }

            // User not found
            if (!user) {
                return done({
                    status: 404,
                    message: 'User not found',
                    code: 'user-not-found'
                })
            }
            if (! await user.isValidPassword(password)) {
                return done({
                    status: 401,
                    message: 'Invalid password',
                    code: 'invalid-password'
                })
            }
            return done(null, user)
        })
    }
))

function authorize(requiredRole = 'admin') {

    return function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.code(401).send('Unauthorized')
        }
        const { user } = req;

        if (allowedRoles.includes(user.role)) {
            return next()
        }
        res.code(403).send('Forbidden')
    }
}


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = { authorize, passport, registerUser }
