// src/pages/HomePage.jsx

import React from 'react';
import Navbar from '../../Components/Layout/Navbar.jsx';
import Hero from '../../Components/Layout/Hero.jsx';

// (Tùy chọn) import các section khác của trang chủ
// import Features from '../../components/Features/Features';
// import Footer from '../../components/Footer/Footer';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* 

      */}
      <Navbar />
      <Hero />

  
    </div>
  );
};

export default HomePage;