import React, { Component, useState, useEffect } from 'react';
import  PropTypes  from "prop-types";
import './style.css';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import axios from "axios";
import AppBar  from '@mui/material/AppBar';
import Events  from './eventsTab';
import Artists from './artistsTab';
import Venue from './venueTab';
import NoResults from './noResults';
import SwipeableViews from '../react-swipeable-views/src'
import { useTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faV } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery} from '@mui/material'
import { faAngleLeft,  faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from '@mui/material/Alert';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div sx={{ p: 3 }}>
            <p>{children}</p>
          </div>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const EventList = (props) => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [eventDetails, setEventDetails] = useState({});
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedEventArtists, setSelectedEventArtists] = useState(null)
    const [venueDetails, setVenueDetails] = useState([])
    const [favorites, setFavorites] = useState(null);
    const theme = useTheme();
    const [isMusic, setIsMusic]  = useState(false)
    
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    var events = []
    for( let i=0; i < props.events.length;i++){
        let eventName = "";
        let eventIcon = "";
        let eventDate = "";
        let eventTime = "";
        let eventVenue = "";
        let eventGenre = "";
        let eventId = '';

        if ('name' in props.events[i]){
            eventName = props.events[i]["name"];
        }

        if ('id' in props.events[i]){
            eventId= props.events[i]["id"];
        }
        if ('dates' in props.events[i] && 'start' in props.events[i].dates){
            if('localDate' in props.events[i].dates.start){
                eventDate = props.events[i].dates.start.localDate;
            }

            if('localTime' in props.events[i].dates.start){
                eventTime = props.events[i].dates.start.localTime;
            }
        }

        if("images" in props.events[i] && props.events[i].images.length > 0){
            eventIcon = props.events[i].images[0].url;
        }
        if("venues" in props.events[i]._embedded && props.events[i]._embedded.venues.length > 0){

            if(props.events[i]._embedded.venues[0].name != "Undefined" || props.events[i]._embedded.venues[0].name != "undefined" )
            {
                eventVenue = props.events[i]._embedded.venues[0].name;
            }                  
            
        }

        if( "classifications" in props.events[i] && props.events[i].classifications.length>0 && 'segment' in props.events[i].classifications[0]){
            if(props.events[i].classifications[0].segment.name != "Undefined" || props.events[i].classifications[0].segment.name != "undefined" ){
                eventGenre = props.events[i].classifications[0].segment.name;
                
            }
        }
        events.push({
            'name':eventName,
            'date':eventDate,
            'time': eventTime,
            'icon': eventIcon,
            'genre': eventGenre,
            'venue': eventVenue,
            'id':eventId
        })
       
    }    

    const handleEventClick = (event) => {
        console.log('handleEventClick')
        setSelectedEvent(event.id);
        setShowDetails(true);
        console.log(selectedEvent)
      };

      const handleBackClick = () => {
        setSelectedEvent('')
        setEventDetails({})
        setShowDetails(false);
        setSelectedTab(0)
        setSelectedEventArtists(null)
        setVenueDetails([])   
        setIsMusic(false)   
        
      };

      useEffect(() => {
            const fetchArtistDetails = async (eventData) => {
                console.log('fetchArtistDetails')
                var Teams = []
                if('classifications' in eventDetails && eventDetails.classifications.length > 0){
                    if('segment' in eventDetails.classifications[0] && 'name' in  eventDetails.classifications[0].segment){
                        if(eventDetails.classifications[0].segment.name.toLowerCase() != 'music'){
                            return;
                        }
                          
                    }
                }
                if('_embedded' in eventData &&  "attractions" in eventData._embedded && eventData._embedded.attractions.length > 0){
                    for(let i=0; i < eventData._embedded.attractions.length;i++){
                        Teams.push(eventData._embedded.attractions[i].name)
                    }
                }  


                const temp = [];
                for (let i = 0; i < Teams.length; i++) {
                    const artist = Teams[i];
                    try{
                        const albumResponse = await axios.get(`/getArtistAlbums?name=${artist}`);
                        const artistDetails = albumResponse.data;
                        temp.push(artistDetails);
                    }
                    catch (error)
                    {
                        console.log('Artist not found')
                    }
                    
                }
                setSelectedEventArtists(temp); 
                console.log(temp)
            };
            
            // const fetchVenueDetails = async (eventData) => {
            //     if('_embedded' in eventData && 'venues' in eventData._embedded && eventData._embedded.venues.length >0){
            //         var eventVenue = eventData._embedded.venues[0].name;
            //         const params = {
            //             venue: eventVenue
            //         }
            //         const response = await axios.get('/getVenueDetails', {params});
            //         console.log('Venue Details')      
            //         console.log(response.data)
            //         if('_embedded' in response.data){
            //             console.log('Venue from api data')
            //             setVenueDetails(response.data);
            //         }
            //         else{
            //             setVenueDetails(eventData)
            //         }
                                        
            //     }
            // }

            const isMusicRelated = (eventData) => {
                console.log('Inital music '+isMusic)
                if('classifications' in eventData && eventData.classifications.length > 0)
                {
                    if('segment' in eventData.classifications[0] && 'name' in  eventData.classifications[0].segment){
                        if(eventData.classifications[0].segment.name.toLowerCase() == 'music'){
                            setIsMusic(true)
                            return
                        }
                          
                    }
                    if('genre' in eventData.classifications[0] && 'name' in eventData.classifications[0].genre){
                        if(eventData.classifications[0].genre.name.toLowerCase() == 'music'){
                            setIsMusic(true)
                            return
                        }
                        
                    }
            
                    if('subGenre' in eventData.classifications[0] && 'name' in eventData.classifications[0].subGenre){            
                        if(eventData.classifications[0].subGenre.name.toLowerCase() == 'music'){
                            setIsMusic(true)
                            return
                        }
                       
                    }
            
                    if('type' in eventData.classifications[0] && 'name' in eventData.classifications[0].type){
                        if(eventData.classifications[0].type.name.toLowerCase() == 'music'){
                            setIsMusic(true)
                            return
                        }
                       
                    }
            
                    if('subType' in eventData.classifications[0] && 'name' in eventData.classifications[0].subType){
                        if(eventData.classifications[0].subType.name.toLowerCase() == 'music'){
                            setIsMusic(true)
                            return
                        }
                       
                    }

                }

            }

            const fetchEventDetails = async () => {
                console.log('fetchEventDetails')
                const params = {
                    keyword: selectedEvent
                }
                const response = await axios.get('/getEventDetails', {params});      
                console.log(response.data)
                setEventDetails(response.data);
                setVenueDetails(response.data)
                fetchArtistDetails(response.data)
                // fetchVenueDetails(response.data)
                isMusicRelated(response.data)
        
            };        
    
        if (showDetails) {
         fetchEventDetails();          
        }
      }, [selectedEvent, showDetails]);

      useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
      }, []);


    const renderEvents = (event, index) => {
        return ( 
            <tr key={index} onClick={() => handleEventClick(event)}>
                <td>{event.date}<br/>{event.time}</td>
                <td><Image src={event.icon} alt="" style={{width:'auto',  height:'60px' }} /></td>
                <td key={event.name}>{event.name}</td>
                <td>{event.genre}</td>
                <td>{event.venue}</td>
            </tr>
         );
    }
    
    const toggleFavorite = () => {
        console.log('Call toggle')
        if(!eventDetails){
            return
        }
        var eventId = eventDetails.id
        var eventName = eventDetails.name
        var eventDate = ''
        var eventGenre = []
        var eventVenue = ''
        if('dates' in eventDetails && 'start' in eventDetails.dates && 'localDate' in eventDetails.dates.start){
            eventDate = eventDetails.dates.start.localDate
        }

        if('classifications' in eventDetails && eventDetails.classifications.length > 0){
            if('segment' in eventDetails.classifications[0] && 'name' in  eventDetails.classifications[0].segment){
                if(eventDetails.classifications[0].segment.name.toLowerCase() != 'undefined'){
                    eventGenre.push(eventDetails.classifications[0].segment.name)
                }
                  
            }
            if('genre' in eventDetails.classifications[0] && 'name' in eventDetails.classifications[0].genre){
                if(eventDetails.classifications[0].genre.name.toLowerCase() != 'undefined'){
                    eventGenre.push(eventDetails.classifications[0].genre.name)
                }
                
            }
    
            if('subGenre' in eventDetails.classifications[0] && 'name' in eventDetails.classifications[0].subGenre){
    
                if(eventDetails.classifications[0].subGenre.name.toLowerCase() != 'undefined'){
                    eventGenre.push(eventDetails.classifications[0].subGenre.name)
                }
               
            }
    
            if('type' in eventDetails.classifications[0] && 'name' in eventDetails.classifications[0].type){
    
                if(eventDetails.classifications[0].type.name.toLowerCase() != 'undefined'){
                    eventGenre.push(eventDetails.classifications[0].type.name)
                }
               
            }
    
            if('subType' in eventDetails.classifications[0] && 'name' in eventDetails.classifications[0].subType){
    
                if(eventDetails.classifications[0].subType.name.toLowerCase() != 'undefined'){
                    eventGenre.push(eventDetails.classifications[0].subType.name)
                }
               
            }
                
        }

        if('_embedded' in eventDetails && 'venues' in eventDetails._embedded && eventDetails._embedded.venues.length >0){
            eventVenue = eventDetails._embedded.venues[0].name;
        }

        if(favorites && favorites.some(favorite => favorite.id === eventId)){
            const updatedFavorites = favorites.filter(event => event.id !== eventId);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setFavorites(updatedFavorites)
            alert('Event remoed from Favoirites')
        }
        else{
            console.log('here')
            const newEntry = {
                id: eventId,
                name: eventName,
                date: eventDate,
                genre: eventGenre,
                venue: eventVenue
              };

            const updatedFavorites = [...favorites, newEntry];
            setFavorites(updatedFavorites);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            alert('Event added to Favoirites!')
        } 
        
      };

    
    const isMatch = useMediaQuery(theme.breakpoints.up('md'))
    console.log('Is screen md ',isMatch)
    console.log('Is music ', isMusic)

    return (  

        <div className='eventsDiv'>
            {showDetails ? (
                <div className='eventDetailDiv'>
                    <p style={{color:'white', textAlign:'left', paddingLeft:10, paddingTop:10}}><FontAwesomeIcon icon={faChevronLeft} />&nbsp;<button onClick={handleBackClick} style={{ all: 'unset',color:'white', cursor: 'pointer',textDecoration: 'underline'}}>Back</button></p>
                
                    <h2 style={{color:"white", padding:30}}>{eventDetails.name}&nbsp;
                    {/* <FontAwesomeIcon
                            icon={faHeart}
                            onClick={toggleFavorite}
                            style={{ color: favorites.find((fav) => fav.id === eventDetails.id) ? 'red' : 'white', cursor: 'pointer' }}
                    />                    */}
                    {/* <span className="material-icons" onClick={toggleFavorite}
                    style={{ color: favorites.find((fav) => fav.id === eventDetails.id) ? 'red' : 'white', cursor: 'pointer' }}>
                    {favorites.find((fav) => fav.id === eventDetails.id)? 'favorite': 'favorite_border'}  
                    </span> */}
                    <span className="material-icons favorite-circle" style={{color:'white', cursor:'pointer'}} onClick={toggleFavorite}>
                        <span className="heart-icon" style={{ color: favorites.find((fav) => fav.id === eventDetails.id) ? 'red' : 'white'}}>favorite</span>
                    </span>
                    
                    </h2>
                    
                    
                    <AppBar sx={{backgroundColor:'#559A8E'}} position="static">
                        <Tabs value={selectedTab} onChange={handleTabChange} textColor="inherit" variant="fullWidth" aria-label="tabs">
                            <Tab  id = "eventTab" label="Events"  {...a11yProps(0)} style={isMatch ? { paddingLeft: '200px', textTransform:'none' } : {textTransform:'none'}}/>
                            <Tab label="Artists/Teams" {...a11yProps(1)} style={{textTransform:'none'}} />
                            <Tab id="venueTab" label="Venue" {...a11yProps(2)}  style={isMatch ? { paddingRight: '200px',textTransform:'none' } : {textTransform:'none'}}/>
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={selectedTab}
                            onChangeIndex={handleTabChange}
                        >
                            <TabPanel value={selectedTab} index={0}><Events eventTabDetails={eventDetails} dir={theme.direction}/></TabPanel>
                            {/* <TabPanel value={selectedTab} index={1}><Artists eventDetails={eventDetails} fetchArtistAlbums={fetchArtistAlbums} handleFetchArtistAlbums={handleFetchArtistAlbums}/></TabPanel> */}
                            <TabPanel value={selectedTab} index={1}>
                            {isMusic && selectedEventArtists && selectedEventArtists.length > 0 ? (
                                    <Artists eventDetails={eventDetails} artistDetails={selectedEventArtists} dir={theme.direction} />
                                ) : (
                                    <NoResults text="No music related artist details to show" />
                                )}
                            </TabPanel>
                            
                            <TabPanel value={selectedTab} index={2} dir={theme.direction}><Venue venueDetails={venueDetails}/></TabPanel>
                            
                        </SwipeableViews>
                    
                </div>
            ) : 
            (<Table responsive striped hover variant="dark" >
                <thead>
                    <tr>
                    <th style={{borderRadius: '20px 0 0 0', width: '15%' }}>Date/Time</th>
                    <th style={{ width: '15%'}}>Icon</th>
                    <th style={{ width: '40%' }}>Event</th>
                    <th style={{ width: '15%' }}>Genre</th>
                    <th style={{borderRadius: '0 20px 0 0', width: '15%' }}>Venue</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(renderEvents)}
                </tbody>

            </Table>)}
        </div>
    

    );
}
 
export default EventList;