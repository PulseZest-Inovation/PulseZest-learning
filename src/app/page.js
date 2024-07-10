'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from './(pages)/home/page';
import Loading from '../assets/gif/loading.gif';
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay (you can replace this with actual data fetching logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div>
          <LandingPage />
        </div>
      )}
    </div>
  );
};

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-white">
    <img src={Loading} alt="Loading..." className="w-32 h-32 mb-4" />
    <p className="text-gray-800 text-lg absolute bottom-8">Love from ❤️ PulseZest</p>
  </div>
);

export default Home;
