import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Layout from './Layout';
import '../Styles/Home.css';

const MerchantsPage = () => {
  const location = useLocation();
  const { category } = useParams(); // Get category from URL
  const { merchants } = location.state || { merchants: [] }; // Get merchants from state

  return (
    <Layout>
      <div className="content-section merchants">
        <h2>Merchants for {category}</h2>
        {merchants.length > 0 ? (
          <ul>
            {merchants.map((merchant) => (
              <li key={merchant._id}>
                <p>Merchant ID: {merchant._id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No merchants available for this category.</p>
        )}
      </div>
    </Layout>
  );
};

export default MerchantsPage;