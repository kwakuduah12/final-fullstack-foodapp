import React, { useState, useEffect } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa'; // Importing profile icon
import '../Styles/MerchantHome.css';

import Menu from './Menu'; 
import { useAuth } from './userContext';
import axios from 'axios'; // Import axios for backend communication

const MerchantHome = () => {
  const [activeSection, setActiveSection] = useState('dashboard'); 
  const [orders, setOrders] = useState([]); 
  const [mostOrderedFoods, setMostOrderedFoods] = useState([]); 
  const [selectedOrder, setSelectedOrder] = useState(null); // For the selected order details
  const [orderModalOpen, setOrderModalOpen] = useState(false); // Controls modal visibility
  const [profile, setProfile] = useState(null); // For storing merchant profile
  const [storeTypes, setStoreTypes] = useState([]); // Available store types
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(''); // For password validation errors

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchMostOrderedFoods();
    if (activeSection === 'profile') {
      fetchProfile();
      fetchStoreTypes();// Fetch profile only when the profile section is active
    }
  }, [activeSection]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/order/merchant-orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.data);
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchMostOrderedFoods = async () => {
    try {
      const response = await fetch('http://localhost:4000/menu/most-ordered', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMostOrderedFoods(data.data);
      } else {
        console.error("Failed to fetch most ordered foods:", data.message);
      }
    } catch (error) {
      console.error("Error fetching most ordered foods:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:4000/merchant/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data.data); // Store the profile data
      } else {
        console.error("Failed to fetch profile:", data.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const fetchStoreTypes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/store-types', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        setStoreTypes(response.data.store_types);
      } else {
        console.error('Failed to fetch store types:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching store types:', error);
    }
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };
  const handleSeeDetails = (order) => {
    setSelectedOrder(order); // Set the selected order
    setOrderModalOpen(true); // Open the modal
  };

  const handleStatusChange = (newStatus) => {
    // Update the order status on the backend
    axios
      .put(
        `http://localhost:4000/order/update-status/${selectedOrder._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          alert(`Order status updated to: ${newStatus}`);
          setOrderModalOpen(false);
          fetchOrders(); // Refresh the orders list
        } else {
          console.error('Failed to update order status');
        }
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
      });
  };

  // Handle input changes for the edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile details to the backend
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put('http://localhost:4000/merchant/profile', profile, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        setProfile(response.data.updatedProfile);
        setEditModalOpen(false);
      } else {
        console.error('Failed to update profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete('http://localhost:4000/merchant/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        alert('Account deleted successfully!');
        setDeleteModalOpen(false); // Close the modal
      } else {
        console.error('Failed to delete account:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(''); // Clear any previous errors
  
    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in both fields.');
      return;
    }
  
    if (currentPassword === newPassword) {
      setPasswordError('Cannot use the same password.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:4000/merchant/change-password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setPasswordError('Current password incorrect.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Current password incorrect.');
    }
  };

  return (
    <div className="home-page">
      <HeaderHome />
      <div className="main-container">
        <Sidebar handleMenuClick={handleMenuClick} />
        <div className="main-content">
          {activeSection === 'dashboard' && (
            <div>
              <div className="section">
                <h2 className="section-title">Current Orders</h2>
                <div className="order-list">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order._id} className="order">
                        <p>Order ID: {order._id}</p>
                        <p>Total Price: ${order.total_price}</p>
                        <p>Status: {order.status}</p>
                        <p>Name of Customer: {order.user_id.name}</p>
                        <p>Order Date: {new Date(order.order_date).toLocaleString()}</p>
                        {order.items && order.items.length > 0 ? (
                          <div>
                          <h4>Items:</h4>
                          {order.items.map(item => (
                          <p key={item._id}>{item.menu_item_id.item_name} - Quantity: {item.quantity}</p>
                          ))}
                          </div>
                          ) : (
                          <p>No items in this order</p>
                          )}
                        <button
                          className="see-details-link"
                          onClick={() => handleSeeDetails(order)}
                        >
                          See Details
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No current orders</p>
                  )}
                </div>
              </div>
  
              {/* Most Ordered Foods Section */}
              <div className="section">
                <h3 className="section-title">Most Ordered Foods</h3>
                <div className="food-list">
                  {mostOrderedFoods.length > 0 ? (
                    mostOrderedFoods.map((food) => (
                      <div key={food._id} className="food-item">
                        <img
                          src={food.imageUrl || '/default-food.png'}
                          alt={food.item_name || 'Food Item'}
                        />
                        <p>{food.item_name}</p>
                      </div>
                    ))
                  ) : (
                    <p>No popular items found</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'menu' && <Menu />} 
          
          {activeSection === 'profile' && (
            <div className="section">
              {profile ? (
                <div className="profile">
                  <FaUserCircle className="profile-icon" />
                  <div className="divider"></div>
                  <div className="profile-details">
                    <p><strong>Store Name:</strong> {profile.store_name}</p>
                    <p><strong>Address:</strong> {profile.address}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone Number:</strong> {profile.phone_number}</p>
                    <p><strong>Store Type:</strong> {profile.store_type}</p>
                    <button onClick={() => setEditModalOpen(true)} className="edit-btn">Edit Account</button>
                    <button onClick={() => setDeleteModalOpen(true)} className="delete-btn">Delete Account</button>
                  </div>
                </div>
              ) : (
                <p>Loading profile...</p>
              )}
            </div>
          )}

          {(activeSection === 'orders' || activeSection === 'reviews' || activeSection === 'promotions') && (
            <div className="section">
              <h2>Under Construction</h2>
              <p>This section is still under construction. Please check back later!</p>
            </div>
          )}
        </div>
      </div>


      {/* Order Details Modal */}
    {orderModalOpen && selectedOrder && (
      <div className="modal">
        <div className="modal-content">
          <h3>Order Details</h3>
          <p>
            <strong>Order ID:</strong> {selectedOrder._id}
          </p>
          <p>
            <strong>Total Price:</strong> ${selectedOrder.total_price}
          </p>
          <p>
            <strong>Status:</strong> {selectedOrder.status}
          </p>
          <p>
            <strong>Customer Name:</strong> {selectedOrder.user_id.name}
          </p>
          <p>
            <strong>Delivery Method:</strong> {selectedOrder.delivery_method}
          </p>
          <p>
            <strong>Order Date:</strong>{' '}
            {new Date(selectedOrder.order_date).toLocaleString()}
          </p>
          <h4>Items:</h4>
          {selectedOrder.items && selectedOrder.items.length > 0 ? (
            selectedOrder.items.map((item) => (
              <p key={item._id}>
                {item.menu_item_id.item_name} - Quantity: {item.quantity}
              </p>
            ))
          ) : (
            <p>No items in this order</p>
          )}
          <h4>Change Order Status:</h4>
          <button
            onClick={() => handleStatusChange('In Progress')}
            className="edit-btn"
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusChange('Waiting for Dasher')}
            className="edit-btn"
          >
            Waiting for Dasher
          </button>
          <button
            onClick={() => handleStatusChange('Given to Dasher')}
            className="edit-btn"
          >
            Given to Dasher
          </button>
          <button
            onClick={() => setOrderModalOpen(false)}
            className="delete-btn"
          >
            Close
          </button>
        </div>
      </div>
    )}

      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Account</h3>
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="store_name"
                  value={profile.store_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type= "password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              {passwordError && <p className="error-message">{passwordError}</p>}

              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={profile.phone_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Store Type:</label>
                <select
                  name="store_type"
                  value={profile.store_type}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select Store Type
                  </option>
                  {storeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={handleEditSubmit}>
                Save Changes
              </button>
              <button type="button" onClick={handlePasswordChange}>
                Change Password
              </button>
              <button onClick={() => setEditModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete your account?</h3>
            <button onClick={handleDeleteAccount}>Yes, Delete</button>
            <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const Sidebar = ({ handleMenuClick }) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleClick = (section) => {
    handleMenuClick(section);
    setActiveSection(section);  
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {/* Update Dashboard to directly handle state */}
        <li
          className={activeSection === 'dashboard' ? 'active' : ''}
          onClick={() => handleClick('dashboard')}
        >
          Dashboard
        </li>
        <li
          className={activeSection === 'orders' ? 'active' : ''}
          onClick={() => handleClick('orders')}
        >
          Orders
        </li>
        <li
          className={activeSection === 'reviews' ? 'active' : ''}
          onClick={() => handleClick('reviews')}
        >
          Reviews
        </li>
        <li
          className={activeSection === 'promotions' ? 'active' : ''}
          onClick={() => handleClick('promotions')}
        >
          Promotions
        </li>
      </ul>
      <hr className="divider" />
      <ul className="sidebar-bottom-menu">
        <li
          className={activeSection === 'menu' ? 'active' : ''}
          onClick={() => handleClick('menu')}
        >
          Menu
        </li>
        <li
          className={activeSection === 'profile' ? 'active' : ''}
          onClick={() => handleClick('profile')}
        >
          Profile
        </li>
        <li>Cash Account</li>
        <li>Help</li>
        <li>Sign Out</li>
      </ul>
    </div>
  );
};

const HeaderHome = () => {
  const { userInfo } = useAuth(); // Assuming userInfo contains the store_name
  return (
    <header className="header-home">
      <div className="header-left">
        <h1 className="logo">HomeDasher</h1>
      </div>
      <div className="header-center">
        {/* Add the welcome message */}
        <h2 className="welcome-text">Welcome! {userInfo?.store_name || "Your Store"}</h2>

        {/* The "View Store As A Customer" button */}
        <button className="user-button">
          <span className="user-text">View Store As A Customer</span>
        </button>
      </div>
      <div className="header-right">
        <FaBell className="icon" />
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 HomeDasher. All rights reserved.</p>
        <div className="social-links">
          <a href="#facebook">Victor</a>
          <a href="#instagram">Lawrencia</a>
          <a href="#twitter">Kwaku</a>
          <a href="#twitter">Chellissa</a>
          <a href="#twitter">Hanjoline</a>
          <a href="#twitter">Vincent</a>
        </div>
      </div>
    </footer>
  );
};

export default MerchantHome;