import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backgroundImage: 'url("https://img.freepik.com/free-vector/green-shaded-mountains-landscape_23-2148272400.jpg?w=740&t=st=1720724485~exp=1720725085~hmac=8015c97706a83ef6bd366616226d90eddcb3dd69409fa76bb8a624cdb8c56b80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#ffffff',
    padding: '30px 0',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    position: 'relative', // Ensure relative positioning for child elements
  };

  const sectionStyle = {
    flex: '1',
    marginBottom: '20px',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const logoImgStyle = {
    width: '50px',
    height: 'auto',
    marginRight: '10px',
  };

  const companyNameStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  const headingStyle = {
    color: '#00ff00',
    fontSize: '1.1rem',
    marginBottom: '10px',
  };

  const ulStyle = {
    listStyleType: 'none',
    padding: '0',
  };

  const liStyle = {
    marginBottom: '5px',
  };

  const linkStyle = {
    color: '#ffffff',
    textDecoration: 'none',
  };

  const contactInfoStyle = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    justifyContent: 'space-between',
    width: '100%', // Ensures the items span the entire width
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px', // Adjust spacing between icon and text
  };

  const spanStyle = {
    flex: '1', // Ensures the middle span takes up remaining space
    margin: '0 -140px', // Adjust spacing around the middle span
  };






  return (
    <div>
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div className="footer-content" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={sectionStyle}>
            <div style={logoStyle}>
              <img src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/logo.png?alt=media&token=208465a0-63ae-4999-9c75-cf976af6a616" alt="Company Logo" style={logoImgStyle} />
              <span style={companyNameStyle}>PulseZest-Learning</span>
            </div>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Learning</h3>
            <ul style={ulStyle}>
              <li style={liStyle}><a href="#" style={linkStyle}>Web</a></li>
              <li style={liStyle}><a href="#" style={linkStyle}>App</a></li>
              <li style={liStyle}><a href="#" style={linkStyle}>Server</a></li>
            </ul>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Products</h3>
            <ul style={ulStyle}>
              <li style={liStyle}><a href="#" style={linkStyle}>Bootcamp</a></li>
              <li style={liStyle}><a href="#" style={linkStyle}>Webinar</a></li>
              <li style={liStyle}><a href="#" style={linkStyle}>Seminar</a></li> {/* Replace with icon and link */}
            </ul>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Community</h3>
            <ul style={ulStyle}>
              <li style={liStyle}><a href="https://www.instagram.com/pulsezest/" style={linkStyle}>Instagram</a></li>
              <li style={liStyle}><a href="https://discord.gg/9RnH5jPr" style={linkStyle}>Discord</a></li>
              <li style={liStyle}><a href="https://pulsezest.com/" style={linkStyle}>Website</a></li>
            </ul>
          </div>
        </div>
        <div className="contact-info" style={contactInfoStyle}>
          <div style={contactItemStyle}>
            <a href="tel:+916396219233" style={{ display: 'flex', alignItems: 'center', color: '#ffffff', textDecoration: 'none' }}>
              <img src="https://files.codingninjas.com/phone-31845.svg" alt="Phone Icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
              +91 6396219233
            </a>
          </div>
          <div style={contactItemStyle}>
            <span style={spanStyle}>Copyright © 2024 PulseZest - by PulseZest</span>
            <a href="mailto:info@pulsezest.com" style={{ display: 'flex', alignItems: 'center', color: '#ffffff', textDecoration: 'none' }}>
              <img src="https://files.codingninjas.com/email-fill-31846.svg" alt="Email Icon" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
              info@pulsezest.com
            </a>
          </div>
        </div>
       
      </div>
    </footer>
   {/* Grey Section with Double Text */}
<div style={{ backgroundColor: '#0000', padding: '20px 0', textAlign: 'center' }}>
  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', position: 'relative', display: 'inline-block' }}>
          ⭐ PULSE ZEST LEARNING ⭐
 
  </div>
</div>
</div>
  );
};

export default Footer;
