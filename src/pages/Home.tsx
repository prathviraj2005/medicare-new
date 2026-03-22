import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { medicineAPI } from '../services/api';
import './Home.css';
import medicareBg from "../assests/medicare.png";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

const Home: React.FC = () => {
  const [contactInfo] = useState<ContactInfo>({
    phone: '+91 9876543210',
    email: 'support@medicare.com',
    address: 'Mumbai, Maharashtra, India'
  });

  const [medicinesCount, setMedicinesCount] = useState(0);
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await medicineAPI.getAll();
        setMedicinesCount(res.data.length);
      } catch (error) {
        console.error("Error fetching medicines count:", error);
      }
    };
    fetchMedicines();
  }, []);

  const openChatbot = () => {
    window.dispatchEvent(new Event('openChatbot'));
  };
  return (
    <div className="home">
      <section className="hero"  style={{
     backgroundImage: `url(${medicareBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}>
        <div className="container hero-container">
          <div className="hero-content">
            
            <h1 className="hero-title">Your Health, Our Priority</h1>
            <p className="hero-subtitle">
              AI-powered online pharmacy with smart medicine recommendations and prescription management
            </p>
            <div className="hero-buttons">
              <Link to="/catalog" className="btn btn-primary">Browse Medicines</Link>
              <Link to="/signup" className="btn btn-secondary">Get Started</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="card-icon">🏥</div>
              <h3>Trusted Service</h3>
              <p>Licensed pharmacists</p>
            </div>
            <div className="hero-card" onClick={() => window.location.href='/catalog'} style={{ cursor: 'pointer' }}>
              <div className="card-icon">💊</div>
              <h3>{medicinesCount}+ Medicines</h3>
              <p>Wide range available</p>
            </div>
            <div className="hero-card">
              <div className="card-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick & reliable</p>
            </div>
            <div className="hero-card" onClick={openChatbot} style={{ cursor: 'pointer' }}>
              <div className="card-icon">💬</div>
              <h3>AI Assistant</h3>
              <p>Smart recommendations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose MediCare?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Safe</h3>
              <p>Your data is protected with industry-standard encryption</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Quick Service</h3>
              <p>Fast ordering process with instant confirmation</p>
            </div>
            <div className="feature-card" onClick={openChatbot} style={{ cursor: 'pointer' }}>
              <div className="feature-icon">🤖</div>
              <h3>AI Chatbot</h3>
              <p>Intelligent assistant for medicine ordering and queries</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone</h3>
              <p>{contactInfo.phone}</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>{contactInfo.email}</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Address</h3>
              <p>{contactInfo.address}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
