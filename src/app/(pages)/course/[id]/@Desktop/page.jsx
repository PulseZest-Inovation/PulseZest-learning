'use client'

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../utils/Firebase/firebaseConfig"; // Adjust the path based on your project structure

export default function CourseDesktopScreen({ params }) {
  const docId = params.id;
  const [courseData, setCourseData] = useState({
    courseName: '',
    introVideo: '',
    courseLevel: '',
    regularPrice: '',
    salePrice: '',
    description: '',
    whatYouLearn: [],
    courseRequirements: [],
    instructor: '',
    duration: '',
    language: '',
    rating: ''
  });
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const docRef = doc(db, "courses", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCourseData(docSnap.data());
        } else {
          console.log("No such document!");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting document:", error);
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [docId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-200 pt-8 pb-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <h1>{courseData.courseName}</h1>
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
              <h2 className="text-3xl font-bold text-green-600">
                {courseData.courseName}
              </h2>
              <p className="text-lg text-gray-600">
                {courseData.courseLevel}
              </p>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-4">
              {courseData.salePrice && (
                <span className="line-through"> {courseData.regularPrice}</span>
              )}
              {" "}
              {courseData.salePrice}

            </div>

          </div>
          <div className="p-6 flex justify-end">
      <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
        Enroll Now
      </button>
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
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-700">
                Instructor: {courseData.instructor}
              </p>
              <p className="text-lg text-gray-700">
                Duration: {courseData.duration}
              </p>
              <p className="text-lg text-gray-700">
                Language: {courseData.language}
              </p>
              <p className="text-lg text-gray-700">
                Rating: {courseData.rating} / 5
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}