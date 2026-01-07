const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Artist name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    songId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Song',
    },
    photoUrl: String
},
    {
        timestamps: true
    });

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;