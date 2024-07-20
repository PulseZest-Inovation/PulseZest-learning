'use client';
import React, { useEffect } from 'react';
import VanillaTilt from 'vanilla-tilt';
import Image from 'next/image';

const courses = [
  {
    id: 1,
    title: 'Course 1',
    description: 'This is an amazing course that covers XYZ topics.',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/android%2FAndroid%20Development.png?alt=media&token=bd4aebc0-2f78-48b3-84a9-d224fdc8f951',
    progress: 60,
    category: 'Development',
    level: 'Intermediate',
  },
  {
    id: 2,
    title: 'Course 2',
    description: 'This is another amazing course that covers ABC topics.',
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/android%2FAndroid%20Development.png?alt=media&token=bd4aebc0-2f78-48b3-84a9-d224fdc8f951',
    progress: 30,
    category: 'Design',
    level: 'Beginner',
  },
];

const DesktopMyCourses = () => {
  useEffect(() => {
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
      max: 25,
      speed: 400,
    });
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-6xl font-bold text-black mb-12 text-center">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="tilt bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 relative"
            style={{ perspective: 1000 }}
          >
            <div className="relative">
              <Image
                src={course.thumbnail}
                alt={course.title}
                className="object-cover rounded-lg mb-4"
                width={600} // Adjust width as needed
                height={400} // Adjust height as needed
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl font-bold">{course.progress}% Complete</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {course.progress}% complete
            </div>
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {course.category}
            </div>
            <div className="absolute bottom-4 left-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              {course.level}
            </div>
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${course.progress}%`, transition: 'width 1s' }}
              ></div>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full w-full text-center font-semibold hover:bg-blue-600 transition-colors duration-300"
              onClick={() => alert(`Starting ${course.title}`)}
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
