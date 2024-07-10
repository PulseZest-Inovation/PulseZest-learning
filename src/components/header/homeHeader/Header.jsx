import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../assets/image/logo.png';
import { auth, firestore } from '../../.././app/Utils/Firebase/firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [typingText, setTypingText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  const autoTypeText = [
    'CODING FOR NATION',
    'START CODING TODAY',
    'LEARN CODE CHANGE WORLD.',
    'PULSEZEST IS BEST :)'
  ];
  const autoTypeSpeed = 100;

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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const closeMenus = () => {
    setIsOpen(false);
    setIsLoginOpen(false);
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, uid } = result.user;

      const userDetails = {
        name: displayName,
        email: email,
        userId: uid,
        suid: generateSUID(),
      };

      const usersCollection = collection(firestore, 'users');
      const userDoc = doc(usersCollection, uid);
      await setDoc(userDoc, userDetails);

      setUser(result.user);
      setIsLoginOpen(false);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const generateSUID = () => {
    return Math.floor(1000000 + Math.random() * 9000000);
  };

  const handleLoginClick = () => {
    if (user) {
      window.location.href = `/${user.displayName.replace(/\s+/g, '-').toLowerCase()}-dashboard`;
    } else {
      toggleLogin();
    }
  };

  return (
    <header className="bg-white text-gray-800 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        <div className="text-2xl font-extrabold">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
              <span className="text-green-400">PulseZest-Learning</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center">
          <span className="font-bold text-2xl">
            {typingText.split('').map((char, index) => (
              <span key={index} style={{ color: `hsl(${(index * 10) % 460}, 70%, 50%)`, fontWeight: 'bold', textShadow: '0 0 10px rgba(0,0,0,0.3)' }}>{char}</span>
            ))}
            {cursorVisible && <span className="animate-blink">|</span>}
          </span>
        </div>

        <nav className="hidden md:flex md:items-center space-x-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/web">Web</NavLink>
          <NavLink href="/android">Android</NavLink>
          <NavLink href="/server">Server</NavLink>
          <NavLink href="/bootcamp">Bootcamp</NavLink>
          <NavLink href="/contact">Contact</NavLink>
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
              {user ? 'Dashboard' : 'Login'}
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
                    <div className="flex items-center mb-6">
                      <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
                      <span className="text-green-400 text-2xl font-extrabold">PulseZest-Learning</span>
                    </div>

                    <button onClick={handleLogin}>Login with Google</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

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
            {user ? 'Dashboard' : 'Login'}
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
                  <div className="flex items-center mb-6">
                    <Image src={Logo} alt="Company Logo" className="h-8 mr-2" width={32} height={32} />
                    <span className="text-green-400 text-2xl font-extrabold">PulseZest-Learning</span>
                  </div>

                  <button onClick={handleLogin}>Login with Google</button>
                </div>
              </div>
            </div>
          )}
        </div>
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
