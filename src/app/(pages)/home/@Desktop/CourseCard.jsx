// src/app/pages/home/@Desktop/CategoryCard.jsx

import React from 'react';
import Link from 'next/link';

const CategoryCard = ({ category }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 transform hover:scale-105">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
        <div className="mt-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Courses:</h3>
          <ul>
            {category.courses.map(course => (
              <li key={course.id} className="mb-4">
                <Link href={`/home/${course.id}`}>
                  <p className="block bg-green-100 hover:bg-green-400 rounded-lg p-4 transition duration-300">
                    <div className="flex items-center mb-2">
                      <img
                        src={course.thumbnail} // Assuming each course has a thumbnail URL or path
                        alt={course.name}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                      <div className="ml-2">
                        <h4 className="text-lg font-semibold text-gray-800">{course.name}</h4>
                        <p className="text-sm text-gray-900">{course.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{course.courseLevel}</span>
                      <span className="text-sm text-gray-500">{course.publishDate}</span>
                    </div>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
