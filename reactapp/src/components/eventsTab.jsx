import React, { Component, useState, useEffect } from 'react';
import './style.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter,faSquareFacebook } from '@fortawesome/free-brands-svg-icons';

const Events = (props) => {
    const eventDetails = props.eventTabDetails
    const [imageError, setImageError] = useState(false);
    var eventTeams = []
    var eventVenue = ""
    var eventGenre = []
    var priceRanges = [] //TODO
    var eventDate = ''
    var seatMap = "";    
    var ticketStatus = '';
    
    var ticketStatusColorMap={
        'onsale': ['green','On Sale'],
        'offsale': ['red', 'Off Sale'],
        'cancelled': ['black','Cancelled'],
        'postponed': ['orange', 'Postponed'],
         'rescheduled': ['orange', 'Rescheduled']
    }

    var ticketStatusColor = 'red';
    
    var buyTicket =  'url' in eventDetails? eventDetails.url:'';
    var eventName = 'name' in eventDetails? eventDetails.name: '';
    var eventUrl = 'url' in eventDetails? eventDetails.url:'';
    var eventId  = 'id' in eventDetails? eventDetails.id:'';
    
    if('dates' in eventDetails && 'start' in eventDetails.dates && 'localDate' in eventDetails.dates.start){
        eventDate = eventDetails.dates.start.localDate;
        
    }

    if('_embedded' in eventDetails &&  "attractions" in eventDetails._embedded && eventDetails._embedded.attractions.length > 0){
        for(let i=0; i < eventDetails._embedded.attractions.length;i++){
            eventTeams.push(eventDetails._embedded.attractions[i].name)
        }
    }

    if('_embedded' in eventDetails && 'venues' in eventDetails._embedded && eventDetails._embedded.venues.length >0){
        eventVenue = eventDetails._embedded.venues[0].name;
        
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

    if('priceRanges' in eventDetails){
        if( eventDetails.priceRanges.length > 0 && 'min' in eventDetails.priceRanges[0]){
              priceRanges.push(eventDetails.priceRanges[0].min)  
        }
        if( eventDetails.priceRanges.length > 0 && 'max' in eventDetails.priceRanges[0]){
            priceRanges.push(eventDetails.priceRanges[0].max) 
        }
    }

    if ('dates' in eventDetails && 'status' in eventDetails.dates && 'code' in eventDetails.dates.status){
        ticketStatus= eventDetails.dates.status.code;
        try{
            var arr = ticketStatusColorMap[ticketStatus]
            ticketStatusColor = arr[0]
            ticketStatus = arr[1]
        }
        catch{
            ticketStatusColor = 'red'
        }
    }
    if('seatmap' in eventDetails && 'staticUrl' in eventDetails.seatmap){
        seatMap = eventDetails.seatmap.staticUrl;
    }

    const shareOnFB = () => {
        const shareURL = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(eventUrl)}`
        window.open(shareURL, '_blank');
      };

    const shareOnTwitter = () => {
        const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check ${eventName}\n`)}&url=${encodeURIComponent(eventUrl)}`;
        window.open(shareURL, '_blank');
    }

    async function doesFileExist(urlToFile) {
        if(!seatMap){
            return false
        }
        try {
          const response = await fetch(urlToFile, { method: 'HEAD' });
          if (!response.ok) {
            console.log("Seatmap image doesn't exist");
            return false;
          }
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      

    return (  
        <Container>
            <Row  style={{marginTop:"20px"}} className='justify-content-md-center justify-content-xs-center'>
                <Col xs={12} md={6}>
                    {eventDate && <p className='eventTabHeading'>Date</p>}
                    {eventDate && <p className='eventTabValue'>{eventDate}</p>}
                    {eventTeams.length > 0 && <p className='eventTabHeading'>Artists/Teams</p>}
                    {eventTeams.length > 0&& <p className='eventTabValue'>{eventTeams.join(' | ')}</p>}
                    {eventVenue && <p className='eventTabHeading'>Venue</p>}
                    {eventVenue && <p className='eventTabValue'>{eventVenue}</p>}
                    {eventGenre.length >0 && <p className='eventTabHeading'>Genres</p>}
                    {eventGenre.length > 0 && <p className='eventTabValue'>{eventGenre.join(' | ')}</p>}
                    {priceRanges.length > 0 && <p className='eventTabHeading'>Price Ranges</p>}
                    {priceRanges.length > 0 && <p className='eventTabValue'>{priceRanges.join(' - ')}</p>}
                    {ticketStatus && <p className='eventTabHeading'>Ticket Status</p>}
                    
                    {ticketStatus && 
                        <div id="ticketStatusDiv" style={{backgroundColor:ticketStatusColor }}>
                            <p id='ticket-status' >
                            {ticketStatus}                            
                        </p>
                        </div>
                        
                    }
                    {buyTicket && <p className='eventTabHeading'>Buy Ticket At:</p>}
                    {buyTicket && <p className='eventTabValue'> <a href={buyTicket} target='_blank'>Ticketmaster</a></p> }


                </Col>
                <Col xs={12} md={6} className="image-center">
                    {seatMap && doesFileExist(seatMap) && (
                        <Image
                        className='seatmapImage'
                        src={seatMap}
                        alt=""
                        />
                    )}
                </Col>
            </Row>
            <br />
            <p className='eventTabValue' style={{textAlign:'center'}}>Share On:&nbsp;&nbsp;
                <FontAwesomeIcon  className='show-more-text' icon={faTwitter} color="#00ACEE" size="2x"  onClick={shareOnTwitter} />
                <FontAwesomeIcon className='show-more-text' icon={faSquareFacebook} style={{paddingLeft:10}} color="#243DF6" size="2x" onClick={shareOnFB} />
            </p>
        </Container>
    );
}
 
export default Events;
