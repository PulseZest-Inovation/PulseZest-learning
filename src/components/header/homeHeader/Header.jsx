'use client'

import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../assets/image/logo.png';
import { auth } from '../../../utils/Firebase/firebaseConfig'; // Adjust path as per your project structure
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Ensure you have firebase/firestore installed
import Login from '../../../components/courseComponents/login/page';

const db = getFirestore(); // Initialize Firestore

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ uid: authUser.uid, ...userDoc.data() });
          } else {
            setUser(authUser);
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setIsLoginOpen(false);
  };

  return (
    <header className="bg-white text-gray-800 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        <div className="text-2xl font-extrabold">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
              <span className="text-green-400">PulseZest-Learning 👑</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center space-x-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/web">Web</NavLink>
          <NavLink href="/android">Android</NavLink>
          <NavLink href="/server">Server</NavLink>
          <NavLink href="/bootcamp">Bootcamp</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          
          {/* Conditional rendering based on user state */}
          {user ? (
            <div className="relative">
              <Link href={`/${user.name}/dashboard`}>
                <p className="glitch-button"
                  style={{
                    padding: '15px 25px',
                    borderRadius: '15px',
                    border: '2px solid #212121',
                    color: '#212121',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    overflow: 'hidden',
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4ade80';
                    e.target.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#212121';
                  }}
                >
                  Dashboard
                </p>
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="glitch-button"
                style={{
                  padding: '15px 25px',
                  borderRadius: '15px',
                  border: '2px solid #212121',
                  color: '#212121',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  overflow: 'hidden',
                  transition: 'background-color 0.3s ease, color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4CAF50';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#212121';
                }}
              >
                Login
              </button>
              {isLoginOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end">
                  <div className="bg-white w-80 h-full shadow-md">
                    <div className="flex justify-end p-4">
                      <button
                        onClick={() => setIsLoginOpen(false)}
                        className="text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
                      >
                        <HiX className="text-2xl" />
                      </button>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center mb-6">
                        <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
                        <span className="text-green-400 text-2xl font-extrabold">PulseZest-Learning</span>
                      </div>
                      <div className="w-100">
                        <Login onLogin={handleLogin} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }) => {
  return (
    <Link href={href}>
      <p className="text-gray-800 hover:text-green-400 hover:border-b-2 border-transparent md:border-green-400 transition duration-300 ease-in-out">
        {children}
      </p>
    </Link>
  );
};

export default Header;
