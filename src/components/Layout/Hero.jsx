// src/components/Hero/Hero.jsx

import React from 'react';
import './Hero.css'; 

// 1. Import hình ảnh từ đường dẫn
import slbkImg from '../../assets/slbk.jpg'; 

const Hero = () => {
  return (
    <section className="hero-container">
      <div className="hero-social-proof">
        <div className="avatars">
          {/* 2. Sử dụng biến đã import vào src (nhớ dùng dấu ngoặc nhọn {}) */}
          <img src={slbkImg} alt='Homepage' />
        </div>
      </div>
    </section>
  );
};

export default Hero;