import React from 'react';

const CoursePage = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#ffffff', fontSize: '24px' }}>Advantage Of PulseZest-Learning</h1>
      <div style={{ width: '80%', margin: '20px auto', backgroundColor: '#808080', borderRadius: '10px', padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0000', color: '#ffffff' }}>
              <th style={{ padding: '10px' }}></th>
              <th style={{ padding: '10px' }}>PULSE ZEST LEARNING</th>
              <th style={{ padding: '10px' }}>Other Courses</th>
              <th style={{ padding: '10px' }}>Free Resources</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px' }}>Fastest 1:1 doubt support</td>
              <td style={{ padding: '10px' }}>✅</td>
              <td style={{ padding: '10px' }}>❌</td>
              <td style={{ padding: '10px' }}>❌</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>Expert-led sessions</td>
              <td style={{ padding: '10px' }}>✅</td>
              <td style={{ padding: '10px' }}>❌</td>
              <td style={{ padding: '10px' }}>❌</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>Lifetime access</td>
              <td style={{ padding: '10px' }}>✅</td>
              <td style={{ padding: '10px' }}>❌</td>
              <td style={{ padding: '10px' }}>❌</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>Certification included</td>
              <td style={{ padding: '10px' }}>✅</td>
              <td style={{ padding: '10px' }}>✅</td>
              <td style={{ padding: '10px' }}>❌</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>Hands-on projects</td>
              <td style={{ padding: '10px' }}>✅</td>
              <td style={{ padding: '10px' }}>❌</td>
              <td style={{ padding: '10px' }}>❌</td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CoursePage;
