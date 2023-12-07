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
    User.findOne({ username }, callback)
}


async function registerUser(username, password, name, role, callback) {

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return callback('User already exists');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user instance and save it to the database
    const newUser = new User({ username, passwordHash, role, name });
    await newUser.save();

    callback(null, newUser);
}

passport.use(new LocalStrategy(
    (username, password, done) => {

        findUser(username, async (err, user) => {
            if (err) {
                return done(err)
            }

            // User not found
            if (!user) {
                return done( {
                    message: 'User not found',
                    code: 'user-not-found'
                })
            }
            if (! await user.isValidPassword(password)) {
                return done({
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


passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.username
        });
    });
});


passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports = { authorize, passport, registerUser }
