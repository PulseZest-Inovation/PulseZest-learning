// src/Components/Layout/Header.js
import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image'; // Use Image from next/image for optimized images
import Logo from '../../../../../public/1.png';
import { auth, firestore } from '../../../Utils/Firebase/firebaseConfig'; // Adjust path as per your project structure
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null); // State to hold logged-in user data
  const [typingText, setTypingText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const autoTypeSpeed = 150;

  const autoTypeText = [
    'CODING FOR NATION',
    'START CODING TODAY',
    'LEARN TO CODE. CHANGE YOUR WORLD.',
    'PULSEZEST IS BEST :)'
  ];

  useEffect(() => {
    let currentText = 0;
    let currentChar = 0;

    const interval = setInterval(() => {
      if (currentChar <= autoTypeText[currentText].length) {
        setTypingText(autoTypeText[currentText].substring(0, currentChar));
        currentChar++;
      } else {
        setTimeout(() => {
          setCursorVisible(false);
          setTimeout(() => {
            setCursorVisible(true);
          }, 500);
        }, 500);
        currentChar = 0;
        currentText = (currentText + 1) % autoTypeText.length;
      }
    }, autoTypeSpeed);

    return () => clearInterval(interval);
  }, []);

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to toggle login sidebar
  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    if (window.innerWidth <= 768) {
      setIsOpen(false); // Close only header sidebar on mobile
    }
  };

  // Function to close both menus
  const closeMenus = () => {
    setIsOpen(false);
    setIsLoginOpen(false);
  };

  // Function to handle successful login
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, uid } = result.user;

      // Save user details to Firestore
      const userDetails = {
        name: displayName,
        email: email,
        userId: uid,
        suid: generateSUID(), // Generate random 7-digit SUID
      };

      // Reference to Firestore collection 'users'
      const usersCollection = collection(firestore, 'users');

      // Reference to specific document with user's UID
      const userDoc = doc(usersCollection, uid);

      // Set user details document
      await setDoc(userDoc, userDetails);

      setUser(result.user);
      setIsLoginOpen(false); // Close login sidebar after successful login
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Function to generate random 7-digit SUID
  const generateSUID = () => {
    return Math.floor(1000000 + Math.random() * 9000000); // Random number between 1000000 and 9999999
  };

  // Handle the login button click
  const handleLoginClick = () => {
    if (user) {
      handleLogout();
    } else {
      toggleLogin();
    }
  };

  return (
    <header className="bg-white text-gray-800 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        {/* Logo or Name */}
        <div className="text-2xl font-extrabold">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
              <span className="text-green-400">PulseZest-Learning</span>
            </div>
          </Link>
        </div>

        {/* Navbar for desktop */}
        <nav className="hidden md:flex md:items-center space-x-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/web">Web</NavLink>
          <NavLink href="/android">Android</NavLink>
          <NavLink href="/server">Server</NavLink>
          <NavLink href="/bootcamp">Bootcamp</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          {/* Conditional rendering based on user state */}
          <div className="relative">
            <button
              onClick={handleLoginClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                position: 'relative',
                padding: '15px 25px',
                borderRadius: '15px',
                border: '2px solid #212121',
                color: isHovered ? '#affc00' : '#212121',
                backgroundColor: isHovered ? '#2986cc ' : 'transparent',
                fontWeight: 'bold',
                fontSize: '18px',
                overflow: 'hidden',
                transition: 'color 0.3s, background-color 0.3s',
              }}
              className="glitch-button"
            >
              {user ? 'Dashboard' : 'Login'} {/* Changed 'Logout' to 'Dashboard' */}
              {isHovered && (
                <span
                  className="glitch"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: '#FF0000',
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    animation: 'glitch 1s infinite linear alternate-reverse',
                    zIndex: -1,
                  }}
                />
              )}
              {isLoginOpen && !user && <HiX className="icon" />}
            </button>

            {/* Login Sidebar */}
            {isLoginOpen && !user && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end">
                <div className="bg-white w-80 h-full shadow-md">
                  <div className="flex justify-end p-4">
                    <button
                      onClick={toggleLogin}
                      className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
                    >
                      <HiX className="text-2xl" />
                    </button>
                  </div>
                  <div className="p-8">
                    {/* Company name and logo */}
                    <div className="flex items-center mb-6">
                      <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
                      <span className="text-green-400 text-2xl font-extrabold">PulseZest-Learning</span>
                    </div>

                    {/* Google login button */}
                    <button onClick={handleLogin} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">Login with Google</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <input type="checkbox" id="menu-toggle" className="hidden" checked={isOpen} readOnly />
          <label
            htmlFor="menu-toggle"
            className="hamburger text-gray-800"
            style={{ cursor: 'pointer' }}
            onClick={toggleMenu}
          >
            {isOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
          </label>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white px-2 py-4 ${isOpen ? 'block' : 'hidden'}`}
        style={{ transition: 'height 0.3s ease' }}
      >
        <MobileNavLink href="/" onClick={closeMenus}>
          Home
        </MobileNavLink>
        <MobileNavLink href="/web" onClick={closeMenus}>
          Web
        </MobileNavLink>
        <MobileNavLink href="/android" onClick={closeMenus}>
          Android
        </MobileNavLink>
        <MobileNavLink href="/server" onClick={closeMenus}>
          Server
        </MobileNavLink>
        <MobileNavLink href="/bootcamp" onClick={closeMenus}>
          Bootcamp
        </MobileNavLink>
        <MobileNavLink href="/contact" onClick={closeMenus}>
          Contact
        </MobileNavLink>
        <button
          onClick={handleLoginClick}
          className="block text-gray-800 hover:text-green-400 hover:border-b-2 border-transparent md:border-green-400 py-2 transition duration-300 ease-in-out cursor-pointer w-full text-left"
        >
          {user ? 'Dashboard' : 'Login'}
        </button>

         {/* Login Sidebar for mobile */}
         {isLoginOpen && !user && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end">
                <div className="bg-white w-80 h-full shadow-md">
                  <div className="flex justify-end p-4">
                    <button
                      onClick={toggleLogin}
                      className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
                    >
                      <HiX className="text-2xl" />
                    </button>
                  </div>
                  <div className="p-8">
                    {/* Company name and logo */}
                    <div className="flex items-center mb-6">
                      <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
                      <span className="text-green-400 text-2xl font-extrabold">PulseZest-Learning</span>
                    </div>

                    {/* Google login button */}
                    <button onClick={handleLogin} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">Login with Google</button>
                  </div>
                </div>
              </div>
            )}
      </div>
    </header>
  );
};

// NavLink component for desktop
const NavLink = ({ href, children }) => {
  return (
    <Link href={href}>
      <p className="text-gray-800 hover:text-green-400 hover:border-b-2 border-transparent md:border-green-400 transition duration-300 ease-in-out">
        {children}
      </p>
    </Link>
  );
};

// MobileNavLink component for mobile
const MobileNavLink = ({ href, children, onClick }) => {
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className="block text-gray-800 hover:text-green-400 hover:border-b-2 border-transparent md:border-green-400 py-2 transition duration-300 ease-in-out cursor-pointer"
      >
        {children}
      </div>
    </Link>
  );
};

export default Header;