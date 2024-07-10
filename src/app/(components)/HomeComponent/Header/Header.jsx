// components/Layout/Header.js

import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import Link from 'next/link';
import Logo from '../../../../../public/1.png';
import { auth } from '../../../Utils/Firebase/firebaseConfig'; // Adjust path as per your project structure
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
 

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null); // State to hold logged-in user data

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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <header className="bg-white text-gray-800 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        {/* Logo or Name */}
        <div className="text-2xl font-extrabold">
          <Link href="/">
            <p className="flex items-center space-x-2">
              <span className="text-green-400">PulseZest-Learning</span>
            </p>
          </Link>
        </div>

        {/* Navbar for desktop */}
        <nav className="hidden md:flex md:items-center space-x-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLinkWithDropdown title="Services">
            <DropdownMenu>
              <DropdownItem href="/web-development">Web Development</DropdownItem>
              <DropdownItem href="/app-development">App Development</DropdownItem>
              <DropdownItem href="/backend">Backend</DropdownItem>
              <DropdownItem href="/frontend">Frontend</DropdownItem>
              <DropdownItem href="/server">Server</DropdownItem>
            </DropdownMenu>
          </NavLinkWithDropdown>
          <NavLink href="/contact">Contact</NavLink>
          {/* Conditional rendering based on user state */}
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <div className="relative">
              <button
                onClick={toggleLogin}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
                Login
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
                {isLoginOpen && <HiX className="icon" />}
              </button>

              {/* Login Sidebar */}
              {isLoginOpen && (
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
                        <img src={Logo} alt="Company Logo" className="h-8 mr-2" />
                        <span className="text-green-400 text-2xl font-extrabold">PulseZest-Learning</span>
                      </div>

                      {/* Conditional rendering based on user state */}
                      {user ? (
                        <div>
                          <p>Welcome, {user.displayName}</p>
                          <Link href="/dashboard">
                            <button>Dashboard</button>
                          </Link>
                        </div>
                      ) : (
                        <button onClick={handleLogin}>Login with Google</button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
        <MobileNavLink href="/about" onClick={closeMenus}>
          About
        </MobileNavLink>
        <MobileNavLinkWithDropdown title="Services">
          <DropdownMenu>
            <DropdownItem href="/web-development" onClick={closeMenus}>Web Development</DropdownItem>
            <DropdownItem href="/app-development" onClick={closeMenus}>App Development</DropdownItem>
            <DropdownItem href="/backend" onClick={closeMenus}>Backend</DropdownItem>
            <DropdownItem href="/frontend" onClick={closeMenus}>Frontend</DropdownItem>
            <DropdownItem href="/server" onClick={closeMenus}>Server</DropdownItem>
          </DropdownMenu>
        </MobileNavLinkWithDropdown>
        <MobileNavLink href="/contact" onClick={closeMenus}>
          Contact
        </MobileNavLink>
        {/* Conditional rendering based on user state */}
        {user ? (
          <button onClick={handleLogout} className="block text-gray-800 hover:text-green-400 hover:border-b-2 border-transparent md:border-green-400 py-2 transition duration-300 ease-in-out cursor-pointer w-full text-left">
            Logout
          </button>
        ) : (
          <button
            onClick={toggleLogin}
            className="block text-gray-800 hover:text-green-400 hover:border-b-2 border-transparent md:border-green-400 py-2 transition duration-300 ease-in-out cursor-pointer w-full text-left"
          >
            Login
          </button>
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

// NavLinkWithDropdown component for desktop with dropdown
const NavLinkWithDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={toggleDropdown}>
        <p className="text-gray-800 hover:text-green-400 hover:border-b-2 border-transparent md:border-green-400 transition duration-300 ease-in-out">
          {title}
        </p>
      </div>
      {isOpen && (
        <div className="absolute bg-white shadow-md mt-2 py-2 w-48 rounded-lg z-10">
          {children}
        </div>
      )}
    </div>
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

// MobileNavLinkWithDropdown component for mobile with dropdown
const MobileNavLinkWithDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={toggleDropdown}>
        <div className="block text-gray-800 hover:text-green-400 hover:border-b-2 border-transparent md:border-green-400 py-2 transition duration-300 ease-in-out cursor-pointer">
          {title}
        </div>
      </div>
      {isOpen && (
        <div className="absolute bg-white shadow-md mt-2 py-2 w-48 rounded-lg z-10">
          {children}
        </div>
      )}
    </div>
  );
};

// DropdownMenu component
const DropdownMenu = ({ children }) => {
  return (
    <div className="divide-y divide-gray-200">
      {React.Children.map(children, (child, index) => (
        <div key={index} className="py-2">
          {child}
        </div>
      ))}
    </div>
  );
};

// DropdownItem component
const DropdownItem = ({ href, children, onClick }) => {
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className="block text-gray-800 hover:text-green-400 px-4 py-2 transition duration-300 ease-in-out cursor-pointer"
      >
        {children}
      </div>
    </Link>
  );
};

export default Header;
