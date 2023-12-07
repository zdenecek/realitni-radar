const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true }
}, { collection: 'users' });

UserSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;