'use client'
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { fetchCategories } from '../functions/fetchCourse'; // Adjust import path as per your project structure
import CategoryCard from '@/components/home/CourseCard';

//Here all Landin page features
import HeroSection from '../homeFeatures/heroSection/page';
import JourneyPage from '../homeFeatures/JoiningFeatures/page';
import WhyChooseUs from '../homeFeatures/WhyChooseUs/page';
import BootCampWebinar from '../homeFeatures/BootCamp&Webinar/page';
import FooterPage from '../../../../components/footer/page';
import Advantage from '../homeFeatures/Advantage/page';
import BenefitsSection from '../homeFeatures/BootCamp&Webinar/features/BenefitsSection';
import FacultyPage from '../homeFeatures/Faculty&Students/page';
import StudentSection from '../homeFeatures/Faculty&Students/page2';


const DesktopHomescreen = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

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

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'> 
        <CircularProgress />
      </div>
    );
  }

  return (
       <div>
    <HeroSection/>

    <div className="container mx-auto px-4 py-8 bg-green-400">
      <h1 className="text-4xl font-bold text-White-800 mb-6">Explore Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    
    </div>
    <Advantage/>
    <BootCampWebinar/>
    <BenefitsSection/>
    <FacultyPage/>
    <StudentSection/>
    <WhyChooseUs/>
    <JourneyPage/>
    <FooterPage/>
    </div>
  );
};

export default DesktopHomescreen;
