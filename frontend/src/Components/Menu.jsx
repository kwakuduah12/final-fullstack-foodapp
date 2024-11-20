import React, { useState, useEffect } from 'react';
import '../Styles/Menu.css';
import { FaPlus } from 'react-icons/fa';
import FoodCard from './FoodCard'; 

const Menu = () => {
  const [showAddFoodPopup, setShowAddFoodPopup] = useState(false);
  const [foodData, setFoodData] = useState({
    item_name: '',
    description: '',
    price: '',
    category: '',
    available: false,
  });
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchAvailableFoods();
  }, []);

  const fetchAvailableFoods = async () => {
    try {
      const response = await fetch('http://localhost:4000/menu/most-ordered', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFoods(data.data);
      } else {
        console.error('Failed to fetch food items:', data.message);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const handleAddFoodClick = () => {
    setShowAddFoodPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddFoodPopup(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodData({
      ...foodData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/menu/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(foodData),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Food item added successfully:', data);
        setShowAddFoodPopup(false);
        fetchAvailableFoods(); // Refresh the list after adding a new item
      } else {
        console.error('Failed to add food item');
      }
    } catch (error) {
      console.error('Error adding food item:', error);
    }
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <input 
          type="text" 
          placeholder="Search for food..." 
          className="search-input" 
        />
        <FaPlus className="add-food-icon" onClick={handleAddFoodClick} />
      </div>

      <div className="food-list">
        {foods.map(food => (
          <FoodCard key={food._id} food={food} onEdit={() => {}} /> 
        ))}
      </div>

      {showAddFoodPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add New Food</h3>
            <form onSubmit={handleAddFoodSubmit}>
              <input 
                type="text" 
                name="item_name" 
                placeholder="Food Name" 
                value={foodData.item_name}
                onChange={handleChange}
                required 
              />
              <textarea 
                name="description" 
                placeholder="Description" 
                value={foodData.description}
                onChange={handleChange}
                required 
              />
              <input 
                type="number" 
                name="price" 
                placeholder="Price" 
                value={foodData.price}
                onChange={handleChange}
                required 
              />
              <select 
                name="category" 
                value={foodData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Drink">Drink</option>
                <option value="Other">Other</option>
              </select>
              <div className="availability-container">
                <label htmlFor="availability">Availability</label>
                <input 
                  type="checkbox" 
                  name="available" 
                  id="availability"
                  checked={foodData.available}
                  onChange={handleChange} 
                /> 
              </div>
              <div className="popup-buttons">
                <button type="submit" className="add-food-button">Add Food</button>
                <button type="button" className="cancel-button" onClick={handleClosePopup}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;