require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get('/', (req, res, next) =>{
    res.render('home');
});

app.get('/artist-search', (req, res, next) => {
    const searchTerm = req.query.artist;
    console.log(searchTerm);

   spotifyApi
    .searchArtists(searchTerm)
    .then(data => {
        // console.log('The received data from the API: ', data.body.artists.items);
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        const items = data.body.artists.items
        console.log(items);
        res.render('artist-search', {items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {

const artistId = req.params.artistId
console.log('artist ID:', artistId)

    spotifyApi
        .getArtistAlbums(artistId)
        .then( data => {

            const albums = data.body.items
            
            console.log( 'Data ==>' ,albums);
            res.render('albums', {albums})
        })

        .catch( err => {
            console.log('Error Caught =>>>\n',err);
        })


});


app.get('/tracks/:trackID', (req, res, next) => {
    const trackID = req.params.trackID
    spotifyApi
        .getAlbumTracks(trackID)
        .then( data => {
            console.log( 'Track Data ==>' , data.body.items);
            const tracks = data.body.items
            
            res.render('tracks', {tracks})
        })

        .catch( err => {
            console.log('Error Caught =>>>\n',err);
        })
})

// CID 289045882f73413db9373adb8ec1bb0d

// Secret 933ac9d29b544ea5b46dc4fd5a074914