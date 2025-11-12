// src/pages/HomePage.jsx

import React from 'react';

import Header from '../../components/Header.jsx'; 
import Hero from '../../components/Hero.jsx';
import ProductList from '../../components/ProductList.jsx';
import Footer from '../../components/Footer.jsx'

function HomePage() {
  return (
    <div>
      <main>
        <Hero />       
        <ProductList />
      </main>
    </div>
  );
}

export default HomePage;