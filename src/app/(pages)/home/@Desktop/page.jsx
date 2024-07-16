'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import { fetchCategories } from '../functions/fetchCourse'; // Adjust import path as per your project structure
import CategoryCard from '@/components/home/CourseCard';
import HeroSection from '../homeFeatures/heroSection/page';
import JourneyPage from '../homeFeatures/OurJourney/page';
import WhyChooseUs from '../homeFeatures/WhyChooseUs/page';
import BootCampWebinar from '../homeFeatures/BootCamp&Webinar/page';
import FooterPage from '../../../../components/footer/page';
import Advantage from '../homeFeatures/Advantage/page';
import BenefitsSection from '../homeFeatures/BootCamp&Webinar/features/BenefitsSection';
import FacultyPage from '../homeFeatures/Faculty&Students/page';
import StudentSection from '../homeFeatures/Faculty&Students/page2';
import { auth } from '../../../../utils/Firebase/firebaseConfig';

const DesktopHomescreen = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesList = await fetchCategories();
        setCategories(categoriesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = (uid) => {
    setUserId(uid);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <CircularProgress />
      </div>
    );
  }

  console.log(userId);

  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4 py-8 bg-green-400">
        <h1 className="text-4xl font-bold text-white mb-6">Explore Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} userId={userId} /> // Pass userId as prop
          ))}
        </div>
      </div>
      <Advantage userId={userId} />
      <BootCampWebinar userId={userId} />
      <BenefitsSection userId={userId} />
      <FacultyPage userId={userId} />
      <StudentSection userId={userId} />
      <WhyChooseUs userId={userId} />
      <JourneyPage userId={userId} />
      <FooterPage userId={userId} />
    </div>
  );
};

export default DesktopHomescreen;