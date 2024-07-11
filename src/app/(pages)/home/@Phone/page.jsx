'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon } from '@heroicons/react/outline';
import { fetchCategories } from '../functions/fetchCourse'; // Adjust import path as per your project structure
import CategoryCard from '@/components/home/CourseCard';


export default function PhoneHomescreen() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

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

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-green-600">PulseZest Learning</h1>
        <button onClick={handleNotificationClick} className="focus:outline-none">
          <BellIcon className="w-6 h-6 text-green-600" />
        </button>
      </header>

      <main className="p-4">

      <h2 className="text-xl font-semibold text-green-600">Courses</h2>
      <div className="grid grid-cols-1 gap-4">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-600">Courses</h2>
          <ul className="list-none p-0 space-y-4">
            <li className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold text-gray-800">Course A</h3>
              <p className="text-gray-700">Introduction to Course A</p>
            </li>
            <li className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold text-gray-800">Course B</h3>
              <p className="text-gray-700">Introduction to Course B</p>
            </li>
            <li className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold text-gray-800">Course C</h3>
              <p className="text-gray-700">Introduction to Course C</p>
            </li>
          </ul>
        </section>
      </main>

     
    </div>
  );
}
