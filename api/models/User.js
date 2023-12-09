const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String },
    passwordHash: { type: String},
    role: { type: String, required: true },
    email: { type: String, unique: true},
    favoriteListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
}, { collection: 'users' });

UserSchema.methods.toJSON = function() {
    var obj = this.toObject()
    delete obj.passwordHash
    delete obj.__v
    obj.id = obj._id
    delete obj._id
    return obj
}
  

UserSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.setPassword = async function(password) {
    this.passwordHash = await bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;