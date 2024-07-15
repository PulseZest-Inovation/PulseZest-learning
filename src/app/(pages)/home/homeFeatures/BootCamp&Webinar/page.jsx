"use client"

import React, { useState } from 'react';
import BootCampContent from './features/WebinarContent';
import WebinarContent from './features/BootCampContent';

const App = () => {
  const [selectedOption, setSelectedOption] = useState('BootCamp');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       <nav style={{ backgroundColor: '#4caf50', padding: '10px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button
          style={{
            backgroundColor: selectedOption === 'BootCamp' ? '#ffffff' : 'transparent',
            color: selectedOption === 'BootCamp' ? '#4caf50' : '#ffffff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1rem',
            borderRadius: '5px',
            marginRight: '10px',
            transition: 'background-color 0.3s, color 0.3s'
          }}
          onClick={() => handleOptionChange('BootCamp')}
        >
          Webinar
        </button>
        <button
          style={{
            backgroundColor: selectedOption === 'Webinar' ? '#ffffff' : 'transparent',
            color: selectedOption === 'Webinar' ? '#4caf50' : '#ffffff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1rem',
            borderRadius: '5px',
            transition: 'background-color 0.3s, color 0.3s'
          }}
          onClick={() => handleOptionChange('Webinar')}
        >
          BootCamp
        </button>
      </nav>
      <div style={{ marginTop: '20px', width: '100%', maxWidth: '600px' }}>
        {selectedOption === 'BootCamp' && <BootCampContent />}
        {selectedOption === 'Webinar' && <WebinarContent />}
      </div>
    </div>
  );
};

export default App;
