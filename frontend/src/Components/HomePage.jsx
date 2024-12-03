import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCoffee, FaPizzaSlice, FaHamburger, FaIceCream, FaCarrot, FaFish, FaBreadSlice, FaAppleAlt } from 'react-icons/fa';
import Layout from './Layout';
import '../Styles/Home.css';

const HomePage = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:4000/menu/categories-and-merchants', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCategories(data.data);
      } else {
        console.error('Failed to fetch categories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoryIcons = {
    Coffee: <FaCoffee size={40} />,
    'Main Course': <FaPizzaSlice size={40} />,
    Dessert: <FaHamburger size={40} />,
    Drink: <FaIceCream size={40} />,
    Vegetables: <FaCarrot size={40} />,
    Fish: <FaFish size={40} />,
    Bread: <FaBreadSlice size={40} />,
    Fruits: <FaAppleAlt size={40} />,
  };

  return (
    <Layout>
      <div className="content-section categories">
        <h2>Categories</h2>
        <div className="category-icons">
          {categories.map((category, index) => (
            <div key={index} className="category-icon">
              <Link
                to={`/merchants/${category.category}`}
                state={{ merchants: category.merchants }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {categoryIcons[category.category] || <FaAppleAlt size={40} />}
                <p>{category.category}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;