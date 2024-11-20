import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import '../Styles/Menu.css';

const FoodCard = ({ food, onEdit }) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [foodData, setFoodData] = useState(food);

  const handleEditClick = () => {
    setShowEditPopup(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (onEdit) onEdit(foodData); // Pass updated food data to parent if needed
    setShowEditPopup(false);
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
  };

  return (
    <div className="food-card">
      <img src={food.image || 'path/to/default-image.jpg'} alt="Food" className="food-image" />
      <div className="food-info">
        <h3>
          {food.item_name}{' '}
          <FaEdit className="edit-icon" onClick={handleEditClick} />
        </h3>
        <p>{food.description}</p>
        <p>Category: {food.category}</p>
        <p>Price: ${food.price}</p>
        <p>{food.available ? 'In Stock' : 'Out of Stock'}</p>
      </div>

      {showEditPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Edit Food</h3>
            <form onSubmit={handleEditSubmit}>
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
                <button type="submit" className="edit-food-button">
                  Save Changes
                </button>
                <button type="button" className="cancel-button" onClick={handleClosePopup}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodCard;
