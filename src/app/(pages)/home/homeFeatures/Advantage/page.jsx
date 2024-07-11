import React from 'react';

// Custom styles for glowing text
const glowingTextStyle = {
    color: '#000000', // Changed to black
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(76, 175, 80, 0.8), 0 0 20px rgba(76, 175, 80, 0.6), 0 0 30px rgba(76, 175, 80, 0.4)',
  };
  

// Animation styles
const animatedTableStyle = {
  animation: 'fadeIn 1s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
};

const progressBarContainerStyle = {
    width: '80%',
    margin: '20px auto',
    backgroundColor: '#57656A',
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'left',
  };
  
  const progressBarStyle = {
    height: '25px',
    borderRadius: '20px',
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: '25px',
  };
  
  const progressBar1Style = {
    ...progressBarStyle,
    backgroundImage: 'linear-gradient(to right, pink, violet, orange, red)',
    width: '95%', // Percentage filled
  };
  
  
  
  const progressBar2Style = {
    ...progressBarStyle,
    backgroundColor: '#2A353B', // Orange
    width: '45%', // Percentage filled
  };
const CoursePage = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#3a3a3a', fontSize: '58px', marginBottom: '30px' }}>👑 Advantages of PulseZest-Learning 👑</h1>
      <div style={{ width: '80%', margin: '20px auto', backgroundColor: '#ffffff', borderRadius: '10px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', ...animatedTableStyle }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#4caf50', color: '#ffffff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
              <th style={{ padding: '20px 10px', borderBottom: '2px solid #ffffff' }}></th>
              <th style={{ padding: '20px 10px', borderBottom: '2px solid #ffffff' }}>PULSE ZEST LEARNING</th>
              <th style={{ padding: '20px 10px', borderBottom: '2px solid #ffffff' }}>Other Courses</th>
              <th style={{ padding: '20px 10px', borderBottom: '2px solid #ffffff' }}>Free Resources</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', ...glowingTextStyle }}>Fastest 1:1 doubt support</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#4caf50' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
            </tr>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold',color: 'black', ...glowingTextStyle }}>Expert-led sessions</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#4caf50' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
            </tr>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', ...glowingTextStyle }}>Lifetime access</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#4caf50' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
            </tr>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', ...glowingTextStyle }}>Certification included</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#4caf50' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#4caf50' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
            </tr>
            <tr>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', ...glowingTextStyle }}>Hands-on projects</td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#4caf50' }}>✓</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
              <td style={{ padding: '15px 10px' }}><span style={{ fontSize: '24px', color: '#f44336' }}>❌</span></td>
            </tr>
          </tbody>
        </table>
      </div>
     
        {/* Progress Bars */}
       
        <div style={progressBarContainerStyle}>
        <p style={{ color: '#3a3a3a', marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
  <img 
    src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/2.png?alt=media&token=861cd93c-8d97-4ce5-b6e0-1de3dc4bd509" 
    style={{ height: '2em', width: '2em', marginRight: '0.5em' }} 
    alt="PulseZest logo" 
  /> 
  PulseZest-Learning
</p>

          <div style={progressBar1Style}>95%</div>
        </div>
        <div style={progressBarContainerStyle}>
        <p  style={{ color: '#3a3a3a'}}>Others</p>
          <div style={progressBar2Style}>45%</div>
        </div>
    </div>
  );
}

export default CoursePage;
