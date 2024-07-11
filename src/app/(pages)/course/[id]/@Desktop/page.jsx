'use client'
import React, { useState, useRef } from "react";
import Image from "next/image";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";

export default function CourseDesktopScreen( {params}) {
  // Dummy data, replace with actual data
   const Uid = params.id;

  const courseData = {
    courseLevel: "Beginner",
    courseRequirements: ["Basic knowledge of HTML", "Passion for learning"],
    description:
      "This course is designed to teach you the fundamentals of web development.",
    introVideo:
      "https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/Full_React%2FReact%2FWhat%20is%20Jsx.mp4?alt=media&token=00848fe2-c2d3-411e-93ad-d4903887e36a",
    courseName: "Introduction to Web Development",
    regularPrice: "29,000",
    salePrice: "21,000",
    thumbnail: "https://via.placeholder.com/150",
    whatYouLearn: [
      "Build responsive websites",
      "Understand HTML, CSS, and JavaScript",
      "Deploy websites to the web",
    ],
    instructor: "John Doe",
    duration: "4 weeks",
    language: "English",
    rating: 4.5,
  };

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

  return (
    <div className="min-h-screen bg-green-200 pt-8 pb-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
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
              isPlaying || isHovered ? "opacity-100" : "opacity-0"
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
              <span className="line-through">{courseData.regularPrice}</span>{" "}
              {courseData.salePrice}
            </div>
          </div>
          <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors w-full">
            Enroll Now
          </button>
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
            <ul className="list-disc list-inside text-lg text-gray-700">
              {courseData.whatYouLearn.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-green-600 mb-2">
              Course Requirements
            </h3>
            <ul className="list-disc list-inside text-lg text-gray-700">
              {courseData.courseRequirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
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
