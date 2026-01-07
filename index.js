const express = require('express');
dotenv = require('dotenv').config();
const PORT = process.env.PORT
const path = require('path');
const cors = require('cors');
const dbConnect = require('./db/connection');
const Artist = require('./models/artist');
const Song = require('./models/Song');
const { default: mongoose } = require('mongoose');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// To read req body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
})

// Artist routes
app.post('/create-artist', async (req, res) => {
    try {
        const newArtist = new Artist(req.body);
        const savedArtist = await newArtist.save();

        res.status(200).json({
            message: 'Artist created successfully',
            artist: savedArtist
        });
    }
    catch (error) {
        console.error('Error creating artist:', error);
    }
})

app.post('/login-artist', async(req, res) => {
    const email = req?.body?.email;
    const password = req?.body?.password;
    if(email && password) {
        const findArtist = await Artist.findOne({
            email: email
        });
        if(!email) {
            res.status(500).send('Email not found');
            return;
        }
        else {
            if(findArtist?.password === password){
                res.status(200).send('Login user');
            }
            else {
                res.status(500).send('Wrong credentials');
            }
        }
    }
    else {
        res.status(500).send('incomplete details');
    }
})

app.get('/artists', async (req, res) => {
    try {
        const artists = await Artist.find().populate('songId');

        res.status(200).json({
            message: 'Artist created successfully',
            artists: artists
        });
    }
    catch (error) {
        console.error('Error creating artist:', error);
    }
})

app.put('/update-artist', async (req, res) => {
    const artistData = req.body;
    const updatedArtist = await Artist.updateOne({ _id: artistData?._id }, {
        ...artistData
    });
    res.status(201).send(updatedArtist);
})

app.get('/find-artist/:id', async (req, res) => {
    const foundArtist = await Artist.findOne({ _id: req.params.id }).populate('songId');
    res.status(200).send(foundArtist);
})

app.delete('/delete-artist', async (req, res) => {
    try {
        const artistData = req.body;
        // Delete all songs by artist
        let artistId = req.body.id;
        await Song.deleteMany({
            artistId: artistId
        })

        //artist delete 
        const deleteArtist = await Artist.deleteOne({ _id: artistData?.id }, {
            artistData
        });
        res.status(201).send(deleteArtist)
    }
    catch (err) {
        res.status(500).json({
            err: err
        })
    }
})


app.post('/create-song', async (req, res) => {
    try {
        const data = req.body;
        const newSong = new Song(data);
        const savedSong = await newSong.save();
        const updatedArtist = await Artist.findOneAndUpdate(
            { _id: savedSong.artistId[0] },
            { $push: { songId: savedSong._id } },
            { new: true }
        );

        res.status(201).json({
            savedSong,
            updatedArtist
        })
    }
    catch (err) {
        res.status(500).json({
            err: err
        })
    }
})

app.get('/song/:id', async (req, res) => {
    try {
        const foundArtist = await Artist.findOne({ _id: req.params.id });
        res.status(200).send(foundArtist);
    }
    catch (err) {
        res.status(500).json({
            err: err
        })
    }
})

app.get('/songs', async (req, res) => {
    try {
        const songs = await Song.find({});
        res.status(200).json({
            songs
        })
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
})

app.put('/update-song', async (req, res) => {
    try {
        const songData = req.body;
        const updatedSong = await Song.updateOne({ _id: songData?._id }, {
            ...songData
        });
        res.status(201).send(updatedSong);
    }
    catch (err) {
        res.status(500).json({
            err
        })
    }
})

app.delete('/delete-song', async (req, res) => {
    try {
        const songId = req.body.songId;

        const song = await Song.findOne({
            _id: songId
        });

        const { ObjectId } = require("mongodb");

        const artist = await Artist.updateOne(
            { _id: song.artistId },
            { $pull: { songId: new ObjectId(songId) } },
            { new: true }
        );

        const deletedSong = await Song.deleteOne({ _id: songId });

        res.status(200).json({
            deletedSong
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            err
        })
    }
})

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})