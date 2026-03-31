// src/pages/HomePage.jsx

import Navbar from '../../components/Layout/Navbar.jsx';
import Hero from '../../components/Layout/Hero.jsx';

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