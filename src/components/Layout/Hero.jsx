// src/components/Hero/Hero.jsx

import React from 'react';
import './Hero.css'; // File CSS riêng cho Hero

// Bạn có thể import ảnh avatars từ src/assets/
// import avatar1 from '../../assets/images/avatar1.png';

const Hero = () => {
  return (
    <section className="hero-container">
      {/* Social Proof */}
      <div className="hero-social-proof">
        <div className="avatars">
          {/* <img src={avatar1} alt="User" /> */}
          {/* ... more avatars */}
        </div>
        <div className="proof-text">
          <p>Trusted by 10,000 students</p>
          <span>⭐ 4.6 Rating</span>
          
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="hero-headline">
        Supporting system
        <br />
        Make life in HCMUT worth.
      </h1>

      {/* Sub-headline */}
      <p className="hero-subheadline">
        Built for students, this smart advising system delivers personalized guidance 
        and streamlined planning to support clear, confident academic decisions
      </p>

      {/* CTA Buttons */}
      <div className="hero-cta-buttons">
        <button className="btn btn-primary-green">Start Learning &gt;</button>
        <button className="btn btn-secondary-white">Explore Lessons</button>
      </div>

      {/* Các hình trang trí ở góc (red, blue, yellow) 
          sẽ được thêm bằng CSS (ví dụ: ::before, ::after) 
          hoặc là file ảnh/SVG từ src/assets/
      */}
    </section>
  );
};

export default Hero;