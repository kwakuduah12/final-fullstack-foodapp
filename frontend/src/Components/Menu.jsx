import React, { useState } from 'react';
import '../Styles/Menu.css'; 
import { FaPlus, FaEdit } from 'react-icons/fa';
import Food from '../Assets/Food1.png';

const Menu = () => {
  const [showAddFoodPopup, setShowAddFoodPopup] = useState(false);
  const [showEditFoodPopup, setShowEditFoodPopup] = useState(false);

  const handleAddFoodClick = () => {
    setShowAddFoodPopup(true);
  };

  const handleClosePopup = () => {
    setShowAddFoodPopup(false);
    setShowEditFoodPopup(false); 
  };

  const handleEditFoodClick = () => {
    setShowEditFoodPopup(true); 
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


      <div className="food-card">
        <img src={Food} alt="Food" className="food-image" />
        <div className="food-info">
          <h3>Food Name <FaEdit className="edit-icon" onClick={handleEditFoodClick} /></h3>
          <p>Description of the food</p>
          <p>Category: Main Course</p>
          <p>Price: $15</p>
          <p>Ingredients: Ingredient 1, Ingredient 2</p>
          <p>Preparation Time: 30 mins</p>
          <p>Availability: In Stock</p>
        </div>
      </div>
      <div className="food-card">
        <img src={Food} alt="Food" className="food-image" />
        <div className="food-info">
          <h3>Food Name <FaEdit className="edit-icon" onClick={handleEditFoodClick} /></h3>
          <p>Description of the food</p>
          <p>Category: Main Course</p>
          <p>Price: $15</p>
          <p>Ingredients: Ingredient 1, Ingredient 2</p>
          <p>Preparation Time: 30 mins</p>
          <p>Availability: In Stock</p>
        </div>
      </div>
      <div className="food-card">
        <img src={Food} alt="Food" className="food-image" />
        <div className="food-info">
          <h3>Food Name <FaEdit className="edit-icon" onClick={handleEditFoodClick} /></h3>
          <p>Description of the food</p>
          <p>Category: Main Course</p>
          <p>Price: $15</p>
          <p>Ingredients: Ingredient 1, Ingredient 2</p>
          <p>Preparation Time: 30 mins</p>
          <p>Availability: In Stock</p>
        </div>
      </div>
      <div className="food-card">
        <img src={Food} alt="Food" className="food-image" />
        <div className="food-info">
          <h3>Food Name <FaEdit className="edit-icon" onClick={handleEditFoodClick} /></h3>
          <p>Description of the food</p>
          <p>Category: Main Course</p>
          <p>Price: $15</p>
          <p>Ingredients: Ingredient 1, Ingredient 2</p>
          <p>Preparation Time: 30 mins</p>
          <p>Availability: In Stock</p>
        </div>
      </div>


      

      {showAddFoodPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add New Food</h3>
            <form>
              <input type="text" placeholder="Food Name" required />
              <textarea placeholder="Description" required></textarea>
              <input type="number" placeholder="Price" required />
              <select required>
                <option value="">Select Category</option>
                <option value="appetizer">Appetizer</option>
                <option value="main-course">Main Course</option>
                <option value="dessert">Dessert</option>
              </select>
              <input type="file" accept="image/*" placeholder="Upload Image" required />
              <textarea placeholder="Ingredients (comma-separated)" required></textarea>
              <input type="number" placeholder="Preparation Time (minutes)" required />
              <div className="availability-container">
                <label for="availability">Availability</label>
                <input type="checkbox" id="availability" /> 
              </div>
              <input type="text" placeholder="Promotion/Discount (Optional)" />

              <div className="popup-buttons">
                <button className="add-food-button" onClick={handleAddFoodClick}>Add Food</button>
                <button className="cancel-button" onClick={handleClosePopup}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Food Popup */}
      {showEditFoodPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Edit Food</h3>
            <form>
              <input type="text" placeholder="Food Name" required />
              <textarea placeholder="Description" required></textarea>
              <input type="number" placeholder="Price" required />
              <select required>
                <option value="">Select Category</option>
                <option value="appetizer">Appetizer</option>
                <option value="main-course">Main Course</option>
                <option value="dessert">Dessert</option>
              </select>
              <input type="file" accept="image/*" placeholder="Upload Image" required />
              <textarea placeholder="Ingredients (comma-separated)" required></textarea>
              <input type="number" placeholder="Preparation Time (minutes)" required />
              <div className="availability-container">
                <label for="availability">Availability</label>
                <input type="checkbox" id="availability" /> 
              </div>
              <input type="text" placeholder="Promotion/Discount (Optional)" />

              <div className="popup-buttons">
                <button className="add-food-button" onClick={handleAddFoodClick}>Save Changes</button>
                <button className="cancel-button" onClick={handleClosePopup}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Menu;
