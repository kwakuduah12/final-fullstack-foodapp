// FoodCard.js
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import '../Styles/Menu.css';

const FoodCard = ({ food, onEdit }) => {
  return (
    <div className="food-card">
      <img src={food.image || 'path/to/default-image.jpg'} alt="Food" className="food-image" />
      <div className="food-info">
        <h3>{food.item_name} <FaEdit className="edit-icon" onClick={() => onEdit(food)} /></h3>
        <p>{food.description}</p>
        <p>Category: {food.category}</p>
        <p>Price: ${food.price}</p>
        <p>Availability: {food.available ? 'In Stock' : 'Out of Stock'}</p>
      </div>
    </div>
  );
};

export default FoodCard;