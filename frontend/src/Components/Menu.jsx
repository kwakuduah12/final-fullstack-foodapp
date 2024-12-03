import React, { useState, useEffect } from 'react';
import '../Styles/Menu.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import FaTrash for the delete icon

const Menu = () => {
  const [showAddFoodPopup, setShowAddFoodPopup] = useState(false);
  const [foodData, setFoodData] = useState({
    item_name: '',
    description: '',
    price: '',
    category: '',
    available: false,
  });
  const [foods, setFoods] = useState([]); // State to hold fetched foods

  useEffect(() => {
    fetchAvailableFoods();
  }, []);

  const fetchAvailableFoods = async () => {
    try {
      const response = await fetch('http://localhost:4000/menu/merchant/merchantId', {
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
    setFoodData({
      item_name: '',
      description: '',
      price: '',
      category: '',
      available: false,
    });
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

  const handleEditFood = async (updatedFood) => {
    console.log('Updated Food:', updatedFood); // Debugging: Check the data being sent

    try {
      const response = await fetch(`http://localhost:4000/menu/${updatedFood._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedFood),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Food item updated successfully:', data); // Debugging: Log backend response
        fetchAvailableFoods(); // Refresh the food list
        setShowAddFoodPopup(false); // Close popup
      } else {
        const errorData = await response.json();
        console.error('Failed to update food item:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating food item:', error);
    }
  };

  const handleDeleteFood = async (foodId) => {
    try {
      const response = await fetch(`http://localhost:4000/menu/${foodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Food item deleted successfully:', data);
        fetchAvailableFoods(); // Refresh the list after deletion
      } else {
        console.error('Failed to delete food item');
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
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
        {foods.map((food) => (
          <div key={food._id} className="food-card">
            <img src={food.image || 'path/to/default-image.jpg'} alt="Food" className="food-image" />
            <div className="food-info">
              <h3>
                {food.item_name}{' '}
                <FaEdit 
                  className="edit-icon" 
                  onClick={() => {
                    setFoodData(food); // Populate the form with the food's current data
                    setShowAddFoodPopup(true); // Show popup for editing
                  }} 
                />
                <FaTrash 
                  className="delete-icon" // Add a delete icon
                  onClick={() => handleDeleteFood(food._id)} // Call delete function with the food ID
                  style={{ marginLeft: '10px', cursor: 'pointer', color: 'black' }}
                />
              </h3>
              <p>{food.description}</p>
              <p>Category: {food.category}</p>
              <p>Price: ${food.price}</p>
              <p>{food.available ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </div>
        ))}
      </div>

      {showAddFoodPopup && (
        <div className="popup">
          <div className="popup-content">
              <button className="close-popup" onClick={handleClosePopup}>
                &times;
              </button>
            <h3>{foodData._id ? 'Edit Food' : 'Add New Food'}</h3>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (foodData._id) {
                  handleEditFood(foodData); // Update existing food
                } else {
                  handleAddFoodSubmit(e); // Add new food
                }
              }}
            >
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
                <button type="submit" className="add-food-button">
                  {foodData._id ? 'Save Changes' : 'Add Food'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;