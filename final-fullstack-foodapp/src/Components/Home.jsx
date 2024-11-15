import React from "react";
import BannerImage from "../Assets/home-banner-image.png";
import NavigationBar from "./NavigationBar";
import { FiArrowRight } from "react-icons/fi";
import qualityFood from "../Assets/quality food.PNG"; 
import customizeOrder from "../Assets/Customize Order.PNG";
import fastDelivery from "../Assets/quality food.PNG";
import healthyAndHappy from "../Assets/Customize Order.PNG";



const Home = () => {
  return (
    <div className="home-container">
      <header className="navigation-section">
      <NavigationBar />
      </header>
      
      <section className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading">
            Home Dasher
          </h1>
          <p className="primary-text">
            Do you trust Kwaku, Victor, Lawrencia, Vincent, Chellisa and Hanjoline 
            with your food? Then Login or Create an Account.  Do you trust Kwaku, Victor, Lawrencia, Vincent, Chellisa and Hanjoline 
            with your food? Then Login or Create an Account.  Do you trust Kwaku, Victor, Lawrencia, Vincent, Chellisa and Hanjoline 
            with your food? Then Login or Create an Account. 
          </p>
          <button className="primary-button">
            LOGIN NOW!! <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </section>
      <section className="card-section">
      <div className="card-container">
        <div className="card">
          <img src={qualityFood} alt="Quality Food" />
          <p>QUALITY FOOD</p>
        </div>
        <div className="card">
          <img src={customizeOrder} alt="Customize Order" />
          <p>CUSTOMIZE ORDER</p>
        </div>
        <div className="card">
          <img src={fastDelivery} alt="Fast Delivery" />
          <p>FAST DELIVERY</p>
        </div>
        <div className="card">
          <img src={healthyAndHappy} alt="Healthy and Happy" />
          <p>HEALTHY AND HAPPY</p>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Home; 

