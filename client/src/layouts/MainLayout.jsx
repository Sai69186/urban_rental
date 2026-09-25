import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import KageAmbientAtmosphere from '../components/common/KageAmbientAtmosphere';

const MainLayout = () => {
  return (
    <div className="app-container" style={{ position: 'relative', minHeight: '100vh', background: '#05070a', color: '#dfe7e0', overflow: 'hidden' }}>
      {/* Universal Ambient Light Shafts and Low-Transparency Foreground Silhouettes */}
      <KageAmbientAtmosphere />
      
      <Navbar />
      <main className="main-content" style={{ position: 'relative', zIndex: 10 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
