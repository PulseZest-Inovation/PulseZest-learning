'use client';
import React, { useEffect, useState, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import Image from 'next/image';
import { db, auth } from '../../../../utils/Firebase/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const DesktopMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const tiltRefs = useRef([]);

  useEffect(() => {
    const initializeTilt = () => {
      if (tiltRefs.current) {
        tiltRefs.current.forEach((el) => {
          if (el) {
            VanillaTilt.init(el, {
              max: 25,
              speed: 400,
            });
          }
        });
      }
    };

    initializeTilt();
    // Cleanup function to destroy the tilt effect
    return () => {
      if (tiltRefs.current) {
        tiltRefs.current.forEach((el) => {
          if (el && el.vanillaTilt) {
            el.vanillaTilt.destroy();
          }
        });
      }
    };
  }, [courses]);

  useEffect(() => {
    const fetchUserCourses = async (uid) => {
      try {
        const userCoursesRef = collection(db, 'users', uid, 'courses');
        const userCoursesSnapshot = await getDocs(userCoursesRef);
        const courseIds = userCoursesSnapshot.docs.map(doc => doc.id);

        const coursePromises = courseIds.map(async (courseId) => {
          const courseDoc = await getDoc(doc(db, 'courses', courseId));
          const { name, description, thumbnail } = courseDoc.data();
          console.log(`Fetched course: ${name}, Thumbnail: ${thumbnail}`); // Debugging line
          return { id: courseDoc.id, name, description, thumbnail };
        });

        const courseList = await Promise.all(coursePromises);
        setCourses(courseList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses: ", error);
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserCourses(user.uid);
      } else {
        setCourses([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-6xl font-bold text-black mb-12 text-center">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div
            key={course.id}
            ref={(el) => (tiltRefs.current[index] = el)}
            className="tilt bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 relative"
            style={{ perspective: 1000 }}
          >
            <div className="relative">
              <Image
                src={course.thumbnail || "https://via.placeholder.com/600x400"}
                alt={course.name}
                className="object-cover rounded-lg mb-4"
                width={600}
                height={400}
                unoptimized
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl font-bold">{60}% Complete</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              60% complete
            </div>
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Development
            </div>
            <div className="absolute bottom-4 left-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Intermediate
            </div>
            <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: '60%', transition: 'width 1s' }}
              ></div>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full w-full text-center font-semibold hover:bg-blue-600 transition-colors duration-300"
              onClick={() => alert(`Starting ${course.name}`)}
            >
              Start Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesktopMyCourses;
