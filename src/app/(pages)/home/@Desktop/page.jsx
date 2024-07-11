'use client'
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { fetchCategories } from '../functions/fetchCourse'; // Adjust import path as per your project structure
import CategoryCard from '@/components/home/CourseCard';

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
    <div className="container mx-auto px-4 py-8 bg-green-400">
      <h1 className="text-4xl font-bold text-White-800 mb-6">Explore Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default DesktopHomescreen;
