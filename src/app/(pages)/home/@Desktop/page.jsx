'use client'
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../utils/Firebase/firebaseConfig'; // Adjust import path as per your project structure
import Link from 'next/link';
import CategoryCard from '../../../../components/home/CourseCard';

const DesktopHomescreen = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesList = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const courses = await fetchCourses(doc.id);
        return {
          id: doc.id,
          name: doc.data().name,
          courses
        };
      }));
      setCategories(categoriesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const fetchCourses = async (categoryId) => {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        console.error('Category document not found');
        return [];
      }

      const courses = categoryDoc.data().courses || [];
      const detailedCourses = await Promise.all(courses.map(async (courseId) => {
        const courseRef = doc(db, 'courses', courseId);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          return {
            id: courseDoc.id,
            ...courseDoc.data()
          };
        } else {
          console.error(`Course document ${courseId} not found`);
          return null;
        }
      }));

      return detailedCourses.filter(course => course !== null);
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
