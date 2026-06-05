import React from 'react';
import StarIconSvg from '../assets/star-empty.svg'; // Path from components/ to assets/

const StarIcon = (props) => (
  <img src={StarIconSvg} alt="Star Icon" {...props} /> 
);

export default StarIcon;
