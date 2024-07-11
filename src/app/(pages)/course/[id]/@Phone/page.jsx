'use client'
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PlayIcon, PauseIcon, ArrowLeftIcon } from "@heroicons/react/solid";
import Link from "next/link";
import fetchCourseData from "../Function/fetchCourseData"; // Adjust the import path as per your project structure

export default function CoursePhoneScreen({ params }) {
  const docId = params.id;
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
    rating: ''
  });
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to handle scroll event and show/hide header
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > 50) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures the effect runs only once

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching data
      const data = await fetchCourseData(docId);
      if (data) {
        setCourseData(data);
      }
      setIsLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, [docId]);
  return (
    <div className="min-h-screen bg-green-200 pt-8 pb-16">
      <header
        className={`flex justify-between items-center p-4 bg-white shadow w-full fixed top-0 transition-all duration-300 ${isHeaderVisible ? "" : "-translate-y-full"
          }`}
      >
        <Link href="/home">
          <div className="text-green-600 flex items-center">
            <ArrowLeftIcon className="w-6 h-6 mr-2" />

          </div>
        </Link>
        <h1 className="text-2xl font-bold text-green-600">{courseData.name}</h1>
        <div></div>
      </header>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-20">
        <div className="relative overflow-hidden bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
          <span className="absolute inset-0 bg-blue-500 opacity-50 rounded-md transform rotate-45"></span>
          <span className="absolute inset-0 bg-blue-500 opacity-50 rounded-md transform -rotate-45"></span>
          <span className="relative z-10">Newly Launched</span>
        </div>
        <div className="relative">
          <video
            ref={videoRef}
            src={courseData.introVideo}
            alt="Intro Video"
            width={320} // Adjust dimensions for phone view
            height={180} // Adjust dimensions for phone view
            className="w-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isPlaying || isHovered ? "opacity-100" : "opacity-0"
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
              <p className="text-lg text-gray-600">
                {courseData.courseLevel}
              </p>
            </div>

            <div className="text-3xl font-bold text-green-600 mb-4">
              <span className="line-through">{courseData.regularPrice}</span>{" "}
              {courseData.salePrice}
            </div>
          </div>
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
            <div className="flex justify-start items-center">
              <div className="mr-6">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold text-black">Instructor:</span> Prof. Rishab Chauhan
                </p>
              </div>
            
              <div className="mr-6">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold text-black">Language:</span> Hindi
                </p>
              </div>
              <div>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold text-black">Rating:</span>{" "}
                  ⭐️⭐️⭐️⭐️½
                </p>
              </div>
            </div>


          </div>
          <span className="pb-14">

          </span>
          <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors w-full fixed bottom-10 left-0 right-0 mb-8">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
