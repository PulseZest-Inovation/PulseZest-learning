'use client'

import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/solid';


import fetchCourseData from '../Function/fetchCourseData'; // Adjust the import path as per your project structure
import { useAuthState } from 'react-firebase-hooks/auth'; // Firebase auth hook
import { auth } from '../../../../../utils/Firebase/firebaseConfig'; // Adjust path as per your project
import Link from 'next/link'; // Import Link from Next.js for navigation

export default function CourseDesktopScreen({ params }) {
  const { id } = params; // Destructure id from params
  const [user, loading, error] = useAuthState(auth); // Fetch user state from Firebase auth

  const [courseData, setCourseData] = useState({
    courseName: '',
    introVideo: '',
    courseLevel: '',
    regularPrice: '',
    salePrice: '',
    description: '',
    whatYouLearn: '',
    courseRequirements: '',
    instructor: '',
    duration: '',
    language: '',
    rating: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCourseData(id); // Fetch course data based on id
      if (data) {
        setCourseData(data);
      }
    };

    fetchData();
  }, [id]);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleEnrollClick = () => {
    if (user) {
      // Redirect to checkout page with id
      window.location.href = `/${id}/checkout`;
    } else {
      // Redirect to login or show a message
      console.log('User is not logged in. Redirecting to login page...');
      // For example, you could navigate to a login page using Next.js Link component:
      // Router.push('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while user authentication is in progress
  }

  return (
    <div className="min-h-screen bg-green-200 pt-8 pb-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <h1 className="p-6 text-3xl font-bold text-green-600">{courseData.name}</h1>
        <div className="relative">
          <video
            ref={videoRef}
            src={courseData.introVideo}
            alt="Intro Video"
            width={800}
            height={450}
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
              isPlaying || isHovered ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isPlaying ? (
              <button
                onClick={handlePlayToggle}
                className="text-white bg-green-600 p-3 rounded-full hover:bg-green-700 transition-colors"
              >
                <PauseIcon className="w-10 h-10" />
              </button>
            ) : (
              <button
                onClick={handlePlayToggle}
                className="text-white bg-green-600 p-3 rounded-full hover:bg-green-700 transition-colors"
              >
                <PlayIcon className="w-10 h-10" />
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg text-gray-800">{courseData.courseLevel}</p>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-4">
              ₹{courseData.salePrice && (
                <span className="line-through"> {courseData.regularPrice}</span>
              )}
              {' '}
              {courseData.salePrice}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative overflow-hidden bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                <span className="absolute inset-0 bg-blue-500 opacity-50 rounded-md transform rotate-45"></span>
                <span className="absolute inset-0 bg-blue-500 opacity-50 rounded-md transform -rotate-45"></span>
                <span className="relative z-10">Newly Launched</span>
              </div>
            </div>
            <Link href={`/${id}/checkout`} passHref>
              <p onClick={handleEnrollClick} className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                {user ? 'Enroll Now' : 'Enroll Now'}
              </p>
            </Link>
          </div>

          <br />

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-green-600 mb-2">
              Description
            </h3>
            <p className="text-lg text-gray-700">{courseData.description}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-green-600 mb-2">
              What You Will Learn
            </h3>
            <p className="text-lg text-gray-700">{courseData.whatYouLearn}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-green-600 mb-2">
              Course Requirements
            </h3>
            <p className="text-lg text-gray-700">{courseData.courseRequirements}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-green-600 mb-2">
              Additional Information
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-black">Instructor:</span>🧑‍🏫 Prof. Rishab Chauhan 
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-black">Language:</span> Hindi
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-black">Rating:</span>{" "}
                ⭐️⭐️⭐️⭐️½
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

