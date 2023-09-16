import React, { Component, useState, useEffect } from 'react';
import './style.css';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import axios from "axios";
import spotifyIcon from './spotifyIcon.png';
import { CircularProgressbar, buildStyles} from "react-circular-progressbar";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NoResults from './noResults';

const Artists = (props) => {
    const artistDetails = props.artistDetails
    const eventDetails = props.eventDetails
    const [eventName, setEventName] = useState('')    
    const [index, setIndex] = useState(0);
    var numberOfArtists = artistDetails.length;
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    
    const handlePrevClick = () => {
        if (index === 0) {
          setIndex(numberOfArtists-1);
        } else {
          setIndex(index - 1);
        }
      };
    
      const handleNextClick = () => {
        if (index === numberOfArtists-1) {
          setIndex(0);
        } else {
          setIndex(index + 1);
        }
      };

      if (artistDetails === null) {
        console.log('No artists')
        return (<NoResults text="No Artist details available"/>);
      }

    const showArrows = artistDetails && artistDetails.length > 1;

    return ( 
        <Container  activeIndex={index} onSelect={handleSelect}>
            <Carousel interval={null} controls={showArrows}>
                {artistDetails.map((artist, index) => (
                    <Carousel.Item key={index}>
                     <Container>
                        <Row style={{width:'80%',margin:'0 auto', marginTop:20}}>
                            <Col md={3} xs={12}>
                                <img id= 'artistPicture' src={artist.artistPicture} alt="" />
                                <p className='artistTabHeading' style={{fontSize:18}}>{artist.name}</p>
                            </Col>
                            <Col md={3} xs={12}>
                                <p className="artistTabHeading" style={{fontSize:18}}>Popularity</p>
                                <div style={{ width:50, margin:'0 auto'}} >                                  

                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress  style={{color:'red'}} variant="determinate" value={`${artist.popularity}`} />
                                        <Box
                                            sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            }}
                                        >
                                            {'popularity' in artist && <Typography variant="caption" component="div" color="white">
                                            {`${artist.popularity}`}
                                            </Typography>}
                                        </Box>
                                    </Box>
                                </div>
                                
                                                                
                            </Col>
                            <Col md={3} xs={12}>
                                <p className='artistTabHeading' style={{fontSize:18}}>Followers</p>
                                {'followers' in artist &&  artist.followers != '-' && !isNaN(parseInt(artist.followers)) && (
                                    <p className='eventTabValue'>{parseInt(artist.followers).toLocaleString()}</p>
                                )}
                                {'followers' in artist &&  artist.followers == '-'  && (
                                    <p className='eventTabValue'>{artist.followers}</p>
                                )}
                                
                            
                            </Col>
                            <Col md={3} xs={12}>
                                <p className='artistTabHeading' style={{fontSize:18}}>Spotify</p>
                                { 'spotifyLink' in artist && <p><a href={artist.spotifyLink} target='_blank'><img src={spotifyIcon} style={{width:30,height:30}}/></a></p>}
                            </Col>

                        </Row>

                        <Row className="align-items-center" style={{width:'80%',margin:'0 auto', marginTop:20}}>
                                <p className='eventTabHeading' style={{textAlign:'left', marginBottom:30, fontSize:15}}>Albums featuring {artist.name}</p>
                                
                                {artist.items.map((item, itemIndex) => (
                                <Col md={4} xs={12} key={itemIndex}>
                                    { item.images.length > 1 && <img className="card-img-top" id='artistAlbumImages' key={itemIndex} src={item.images[1].url} style={{marginBottom:20}} />}
                                </Col>
                                ))}                                
                        </Row>
                    </Container>                                      
                    
                </Carousel.Item>
                ))}
            </Carousel>        
        </Container>

    );
}
 
export default Artists;

