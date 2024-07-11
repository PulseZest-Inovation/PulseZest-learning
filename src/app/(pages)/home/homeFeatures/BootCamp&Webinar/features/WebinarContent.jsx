import React, { useEffect, useRef } from 'react';

const WebinarPage = () => {
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const fadeInElements = [headerRef.current, contentRef.current, footerRef.current];

    fadeInElements.forEach((element) => {
      if (element) {
        element.style.opacity = 1;
        element.style.transform = 'translateY(0)';
      }
    });
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', color: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', boxSizing: 'border-box' }}>
      <header ref={headerRef} style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.5s, transform 0.5s' }}>
        <h1>Welcome to Our Webinar</h1>
        <p>Join us for an exciting session!</p>
      </header>

      <section ref={contentRef} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '2rem', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.5s, transform 0.5s' }}>
        <h2>Under Work</h2>
       
      </section>

      <section style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '2rem', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.5s, transform 0.5s' }}>
        <h2>Register Now</h2>
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />
          <input type="email" placeholder="Your Email" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />
          <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', transition: 'background-color 0.3s ease' }}>Register</button>
        </form>
      </section>

      <footer ref={footerRef} style={{ textAlign: 'center', marginTop: 'auto', opacity: 0, transition: 'opacity 0.5s' }}>
        <p>&copy; 2024 Webinar Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WebinarPage;
