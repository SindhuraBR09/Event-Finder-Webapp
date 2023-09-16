const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const https = require('https');
var router = express();
const port = process.env.PORT || 5000; 

router.listen(port, () => console.log(`Server started on port ${port}`));

const path = __dirname + '/client/';

router.use(express.static(path));
router.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});

router.get('/search', function (req,res) {
  res.sendFile(path + "index.html");
});

router.get('/favorites', function (req,res) {
  res.sendFile(path + "index.html");
});



router.get('/searchForEvents', (req, res) => {
    console.log('request received');
    console.log(req.query)
    var geohash = require('ngeohash');
    var geoHashLoc =  geohash.encode(req.query.lat, req.query.lng);
    var category_map = {
        "music":"KZFzniwnSyZfZ7v7nJ",
        "sports": "KZFzniwnSyZfZ7v7nE",
        "art": "KZFzniwnSyZfZ7v7na",
        "film": "KZFzniwnSyZfZ7v7nn",
        "miscellaneous": "KZFzniwnSyZfZ7v7n1"
    }
    var parameters = {}
    parameters['apikey'] = "4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u"
    parameters['keyword'] = req.query.key    
    parameters['radius'] = req.query.dist
    parameters['unit'] = 'miles'
    parameters['geoPoint']= geoHashLoc
    if(req.query.genre != 'default'){
        parameters['segmentId'] = category_map[req.query.genre]
    }

      // At request level
      const agent = new https.Agent({  
        rejectUnauthorized: false
      });
     
      
      const eventsURL = 'https://app.ticketmaster.com/discovery/v2/events.json'
      const queryParams = new URLSearchParams(parameters).toString();

      const fetchUrl = `${eventsURL}?${queryParams}`;
      
      fetch(fetchUrl, {agent})
        .then((response) => response.json())
        .then((data) => res.json(data))
        .catch((error) => console.log(error));
    
});

router.get('/getSuggestions', (req,res)=> {

    const params = {
        apikey : '4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u',
        keyword: req.query.keyword
       }
    const agent = new https.Agent({  
        rejectUnauthorized: false
      });

    const suggestionURL = 'https://app.ticketmaster.com/discovery/v2/suggest'
        
    const queryParams = new URLSearchParams(params).toString();
    
    const fetchUrl = `${suggestionURL}?${queryParams}`;
    
    fetch(fetchUrl, {agent})
      .then((response) => response.json())
      .then((data) => res.json(data))
      .catch((error) => console.log(error));
        

})

router.get('/getEventDetails', (req,res)=> {
    const eventName = req.query.keyword;
    const params = {
        apikey : '4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u',
    }

    const agent = new https.Agent({  
      rejectUnauthorized: false
    }); 
    console.log('Event name '+eventName)
    const eventDetailsURL = `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(eventName)}`

    const queryParams = new URLSearchParams(params).toString();
    const fetchUrl = `${eventDetailsURL}?${queryParams}`;    
    fetch(fetchUrl,  {agent})
      .then((response) => response.json())
      .then((data) => res.json(data))
      .catch((error) => console.log(error));
})

router.get('/getArtistAlbums', async (req,res)=> {
    var artistName = req.query.name;
    console.log('Getting artist details')
    const spotifyApi = new SpotifyWebApi({
        clientId: 'b965510d20cd4de6a922eb6c9017ce96',
        clientSecret: '9cb852b6436d4361916ea6639572c725',
      });

    try {
        var artistPicture, popularity, followers, spotifyLink;
        const { body } = await spotifyApi.clientCredentialsGrant();
        const accessToken = body.access_token;
    
        spotifyApi.setAccessToken(accessToken);
    
        const { body: searchResults } = await spotifyApi.searchArtists(artistName);
        
        const artist = searchResults.artists.items.find(
          (artist) => artist.name.toLowerCase() === artistName.toLowerCase()
        );
    
        if (!artist) {
          res.status(404).send('Artist not found');
          return;
        }
        spotifyLink = artist.external_urls?.spotify ?? '';
        followers = artist.followers?.total ?? '-';
        popularity = artist.popularity ?? '-'
        
        if('images' in artist){
          artistPicture = artist.images[artist.images.length - 1].url ?? ''
        }

        const { body: albums } = await spotifyApi.getArtistAlbums(artist.id, {limit:3});
        albums['spotifyLink'] = spotifyLink
        albums['followers'] = followers;
        albums['popularity'] = popularity;
        albums['artistPicture'] = artistPicture;
        albums['name'] = artistName;
        res.send(albums);
      } 
      catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving artist albums');
      }

})

router.get('/getVenueDetails', (req,res)=> {
  console.log('getting venue')
  const params = {
      apikey : '4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u',
      keyword: req.query.venue   
  }
  const agent = new https.Agent({  
      rejectUnauthorized: false
    });

  const venueURL = 'https://app.ticketmaster.com/discovery/v2/venues/'
      
  const queryParams = new URLSearchParams(params).toString();
  
  const fetchUrl = `${venueURL}?${queryParams}`;
  console.log(fetchUrl)
  fetch(fetchUrl, {agent})
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => console.log(error));      

})

module.exports = router;

