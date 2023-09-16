import React from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css'
import Container from 'react-bootstrap/Container';

const NoResults = (props) => {
    const displayText = props.text
    return (  
        <div id='no-results-div'>
            <Container>
                <p id='no-reults-text'>{displayText}</p>
            </Container>            
        </div>
    );
}
 
export default NoResults;