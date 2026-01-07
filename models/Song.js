const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Song title is required']
    },
    lyrics: {
        type: String,
    },
    artistId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Artist',
        required: [true, 'Artist ID is required']
    },
    image: {
        type: String,
        required: [true, 'Song image cannot be null']
    },
    playCount: {
        type: Number,
        default: 0
    },
    playbackUrl: {
        type: String,
        required: [true, 'Song url cannot be null']
    },
    coverVideoUrl: {
        type: String
    }
}, {
    timestamps: true
});

const Song =  mongoose.model('Song', SongSchema);

module.exports = Song;