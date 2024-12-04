import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaBell, FaUtensils, FaGlobeAfrica, FaPizzaSlice, FaFish, FaCoffee, FaHamburger} from 'react-icons/fa';
import { useAuth } from './userContext'; 
import '../Styles/User.css'; 

const UserPage = () => {
    const { userInfo } = useAuth();
    const [activeSection, setActiveSection] = useState('Home');
    const [searchQuery, setSearchQuery] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [storeTypes, setStoreTypes] = useState([]);
    const [selectedStoreType, setSelectedStoreType] = useState(null);

    useEffect(() => {
        fetchStoreTypes();
        if (activeSection === 'Stores') {
            fetchRestaurants(selectedStoreType);
        } else if (activeSection === 'Merchants') {
            fetchMerchants();
        }
    }, [activeSection, selectedStoreType]);

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

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get('http://localhost:4000/restaurants', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.status === 200) {
                setRestaurants(response.data.restaurants);
            } else {
                console.error('Failed to fetch restaurants:', response.data.message);
                setRestaurants([]);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const fetchMerchants = async () => {
        console.log("Fetching merchants...");
        try {
            const response = await axios.get('http://localhost:4000/merchants', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log("Response received:", response.data);
            if (response.status === 200) {
                setMerchants(response.data.data);
            } else {
                console.error('Failed to fetch merchants:', response.data.message);
                setMerchants([]);
            }
        } catch (error) {
            console.error('Error fetching merchants:', error);
        }
    };

    const handleMenuClick = (section) => {
        setActiveSection(section);
    };

    const handleSignOut = () => {
        console.log("User signed out");
        // Add actual sign-out logic 
    };

    const Header = () => (
        <header className="header-home">
            <div className="header-left">
                <h1 className="logo">HomeDasher</h1>
            </div>
            <div className="header-center">
                <h2 className="welcome-text">Welcome, {userInfo?.name || 'User'}!</h2>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
            </div>
            <div className="header-right">
                <div className="notification-icon">
                    <FaBell className="icon" />
                </div>
            </div>
        </header>
    );

    const Sidebar = ({ activeSection, handleMenuClick }) => (
        <div className="sidebar">
            <ul className="sidebar-menu">
                {['Home', 'Stores', 'Merchants', 'Cart', 'Past Orders'].map((section) => (
                    <li
                        key={section}
                        className={activeSection === section ? 'active' : ''}
                        onClick={() => handleMenuClick(section)}
                    >
                        {section}
                    </li>
                ))}
            </ul>
            <hr className="divider" />
            <ul className="sidebar-bottom-menu">
                {['profile', 'payment'].map((section) => (
                    <li
                        key={section}
                        className={activeSection === section ? 'active' : ''}
                        onClick={() => handleMenuClick(section)}
                    >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </li>
                ))}
                <li>Help</li>
                <li onClick={handleSignOut}>Sign Out</li>
            </ul>
        </div>
    );

    const CategoryCard = ({ category }) => (
        <div className="category-card">
            {category.icon}
            <p>{category.name}</p>
        </div>
    );

    const CategoriesList = () => {
        const categories = [
            { name: 'Breakfast', icon: <FaCoffee /> },
            { name: 'Fast Food', icon: <FaHamburger /> },
            { name: 'Jollof', icon: <FaPizzaSlice /> },
            { name: 'Chinese', icon: <FaFish /> },
            { name: 'African', icon: <FaGlobeAfrica /> },
            
        ];

        return (
            <div className="categories-container">
                {categories.map((category, index) => (
                    <CategoryCard key={index} category={category} />
                ))}
            </div>
        );
    };

    const RestaurantCard = ({ restaurant }) => (
        <div className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>Most Ordered Foods: {restaurant.description || 'N/A'}</p>
            <button className="order-button">Order from this store</button>
        </div>
    );

    const MerchantCard = ({ merchant }) => (
        <div className="merchant-card">
            <h3>{merchant.store_name}</h3>
            <p>Description: {merchant.description || 'N/A'}</p>
            <button className="order-button">Order from this merchant</button>
        </div>
    );

    const MerchantsList = () => (
        <div className="merchants-container">
            {merchants.length > 0 ? (
                merchants.map((merchant) => (
                    <MerchantCard key={merchant._id} merchant={merchant} />
                ))
            ) : (
                <p>No merchants available</p>
            )}
        </div>
    );

    const RestaurantsList = () => {
        const filteredRestaurants = selectedStoreType 
            ? restaurants.filter(restaurant => restaurant.type === selectedStoreType)
            : restaurants;

        return (
            <div className="restaurants-container">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))
                ) : (
                    <p>No restaurants available</p>
                )}
            </div>
        );
    };

    const StoreTypeGrid = () => {
        const storeTypeIcons = {
            Asian: <FaGlobeAfrica />,
            Mexican: <FaUtensils />,
            African: <FaFish />,
            Italian: <FaPizzaSlice />,
        };

        return (
            <div className="store-type-grid">
                {storeTypes.map((type) => (
                    <div className="store-type" key={type.id} onClick={() => setSelectedStoreType(type.id)}>
                        <div className="icon">{storeTypeIcons[type.name] || '🌟'}</div>
                        <p>{type.name}</p>
                    </div>
                ))}
            </div>
        );
    };

    const Footer = () => (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} HomeDasher. All rights reserved.</p>
            </div>
        </footer>
    );

    return (
        <div className="user-page">
            <Header />
            <div className="main-container">
                <Sidebar activeSection={activeSection} handleMenuClick={handleMenuClick} />
                <div className="main-content">
                    {activeSection === 'Home' && (
                        <div className="section">
                            <h3 className="section-title">Categories</h3>
                            <CategoriesList />
                        </div>
                    )}
                    {activeSection === 'profile' && (
                        <div className="section">
                            <h3 className="section-title">User Profile</h3>
                            <div className="profile-details">
                                <FaUserCircle className="profile-icon" />
                                <p>Name: {userInfo?.name || 'Your Name'}</p>
                                <p>Email: {userInfo?.email || 'your.email@example.com'}</p>
                                <p>Phone: {userInfo?.phone || 'Your Phone Number'}</p>
                            </div>
                        </div>
                    )}
                    {activeSection === 'Stores' && (
                        <div className="section">
                            <h3 className="section-title">Available Stores</h3>
                            <StoreTypeGrid />
                            <RestaurantsList />
                        </div>
                    )}
                    {activeSection === 'Merchants' && (
                        <div className="section">
                            <h3 className="section-title">Available Merchants</h3>
                            <MerchantsList />
                        </div>
                    )}
                    {activeSection === 'orders' && (
                        <div className="section">
                            <h3 className="section-title">Your Orders</h3>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserPage;