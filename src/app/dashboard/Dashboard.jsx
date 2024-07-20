'use client';
import React, { useState, useEffect } from 'react';
import { FaBook, FaChartLine, FaCog, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // For programmatic navigation
import Header from './Header';
import NotificationDesktopScreen from './notification/layout';
import DesktopMyCourses from './my-course/@Desktop/page';
import AchievementsPage from './achivment/page';
import DekstopProfileScreen from './profile/@Desktop/page';
import SettignDesktopPage from './setting/@Desktop/page';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [isDesktop, setIsDesktop] = useState(true);
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Set breakpoint for desktop
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize); // Add resize event listener

    return () => window.removeEventListener('resize', handleResize); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    // Update the activeTab based on the pathname
    const path = window.location.pathname;
    if (path.includes('my-course')) setActiveTab('my-course');
    if (path.includes('achievements')) setActiveTab('Achivment');
    if (path.includes('notifications')) setActiveTab('notifications');
    if (path.includes('profile')) setActiveTab('Profile');
    if (path.includes('settings')) setActiveTab('settings');
  }, []);

  if (!isDesktop) {
    return null; // Render nothing if not desktop
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Programmatically navigate to the new route
    router.push(`/dashboard/${tab.toLowerCase()}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'my-course':
        return <DesktopMyCourses />;
      case 'Achivment':
        return <AchievementsPage />;
      case 'notifications':
        return <NotificationDesktopScreen />;
      case 'Profile':
        return <DekstopProfileScreen />;
      case 'settings':
        return <SettignDesktopPage />;
      default:
        return <Courses />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex flex-col">
        <div className="p-6 text-3xl font-extrabold">PulseZest</div>
        <div className="user">Welcome 👋🏻 {'username'}</div>
        <div className="flex flex-col mt-8 space-y-4">
          <button
            onClick={() => handleTabChange('my-course')}
            className={`flex items-center p-4 hover:bg-purple-700 rounded-lg transition-all duration-300 ${
              activeTab === 'my-course' ? 'bg-purple-700' : ''
            }`}
          >
            <FaBook className="mr-3" />
            Courses
          </button>
          <button
            onClick={() => handleTabChange('Achivment')}
            className={`flex items-center p-4 hover:bg-purple-700 rounded-lg transition-all duration-300 ${
              activeTab === 'Achivment' ? 'bg-purple-700' : ''
            }`}
          >
            <FaChartLine className="mr-3" />
            Achivment
          </button>
          <button
            onClick={() => handleTabChange('Profile')}
            className={`flex items-center p-4 hover:bg-purple-700 rounded-lg transition-all duration-300 ${
              activeTab === 'Profile' ? 'bg-purple-700' : ''
            }`}
          >
            <FaUser className="mr-3" />
            Profile
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`flex items-center p-4 hover:bg-purple-700 rounded-lg transition-all duration-300 ${
              activeTab === 'settings' ? 'bg-purple-700' : ''
            }`}
          >
            <FaCog className="mr-3" />
            Settings
          </button>
        </div>
      </div>
      <div className="w-5/6">
        <Header setActiveTab={setActiveTab} />
        <div className="p-2 text-black">{renderContent()}</div>
      </div>
    </div>
  );
};

const Courses = () => (
  <div>
    <h2 className="text-4xl font-extrabold mb-6">Your Courses</h2>
    {/* Add content for Courses here */}
  </div>
);

export default Dashboard;
