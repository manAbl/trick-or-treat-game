import React from 'react'
import './instructions.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Instructions = () => (
  <div className="instructions-container">
    You can move the character with the following controls:
    <br></br>
    <FontAwesomeIcon icon="arrow-up" className="icon" />
    <FontAwesomeIcon icon="arrow-down" className="icon" />
    <FontAwesomeIcon icon="arrow-left" className="icon" />
    <FontAwesomeIcon icon="arrow-right" className="icon" />
  </div>
)

export default Instructions
