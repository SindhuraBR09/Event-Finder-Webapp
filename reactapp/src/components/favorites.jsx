import React, { Component, useState, useEffect } from 'react';
import './style.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import NoResults from './noResults';

const Favorites = () => {

    const [favorites, setFavorites] = useState([]);
    const [active, setActive] = useState('favorites');


    useEffect(() => {
      const favoritesData = JSON.parse(localStorage.getItem('favorites'));
      if (favoritesData) {
        setFavorites(favoritesData);
      }
    }, []);
  
    const handleDelete = (eventId) => {
      const updatedFavorites = favorites.filter(favorite => favorite.id !== eventId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      alert('Event removed from Favorites!')
    }
  
    // if(favorites.length == 0){
    //     return <NoResults text="No favorite events to show"/>
    // }
    return ( 
        <div>               
            <Navbar  className='main-navbar'>
            <Nav activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)} className='ms-auto'>
                <Nav.Link 
                    eventKey='search'
                    className={active === 'search' ? 'active-link' : ''}
                    href="/search"
                    style={{
                        color:'white', 
                        marginRight : 20, 
                        
                    }}                                       
                >Search
                </Nav.Link>
                <Nav.Link 
                    eventKey='favorites'
                    className={active === 'favorites' ? 'active-link' : '' }
                    style={{color:'white', marginRight : 20}} 
                    href='/favorites'
                    >Favorites
                </Nav.Link>
            </Nav>
            </Navbar>
            {favorites.length == 0 && <NoResults text="No favorite events to show"/>}
            {favorites.length > 0 && <p style={{textAlign:'center', marginTop:'20px', marginBottom:'30px',  color:'#65FFE5', fontWeight:'bold', fontSize:20 }}> List of your favourite events</p>}
            { favorites.length > 0 && <Table  responsive hover className='fvt' style={{ margin: '0 auto', borderCollapse: 'separate', borderSpacing: '0 0', backgroundColor: 'white', borderRadius: '10px' }}>
                    <thead>
                    <tr style={{padding:5}}>
                        <th style={{padding:5,borderBottom: '1px solid #ccc', width:'5%'}}>#</th>
                        <th style={{padding:5,borderBottom: '1px solid #ccc', width:'10%'}}>Date</th>
                        <th style={{padding:5,borderBottom: '1px solid #ccc', width:'35%'}}>Event</th>
                        <th style={{padding:5,borderBottom: '1px solid #ccc', width:'30%'}}>Category</th>
                        <th style={{padding:5,borderBottom: '1px solid #ccc', width:'15%'}}>Venue</th>
                        <th style={{padding:5,borderBottom: '1px solid #ccc', width:'5%'}}>Favorite</th>
                    </tr>
                    </thead>
                    <tbody>
                    {favorites.map((favorite, index) => (
                        <tr key={favorite.id} style={{textAlign:'center'}}>
                        <th style={{padding:'5px 5px', borderBottom: '1px solid #ccc'}}>{index + 1}</th>
                        <td style={{padding:'5px 5px',borderBottom: '1px solid #ccc'}}>{favorite.date}</td>
                        <td style={{padding:'5px 10px',borderBottom: '1px solid #ccc'}}>{favorite.name}</td>
                        <td style={{padding:'5px 10px',borderBottom: '1px solid #ccc'}}>{favorite.genre.join(' | ')}</td>
                        <td style={{padding:'5px 10px',borderBottom: '1px solid #ccc'}}>{favorite.venue}</td>
                        <td style={{padding:'5px 5px',borderBottom: '1px solid #ccc'}}>
                            <FontAwesomeIcon icon={faTrashAlt}  onClick={() => handleDelete(favorite.id)} style={{ backgroundColor: 'transparent', cursor:'pointer' }} />
                            
                        </td>
                        </tr>
                    ))}
                    </tbody>
            </Table>}
            
        </div>
     );
}
 
export default Favorites;