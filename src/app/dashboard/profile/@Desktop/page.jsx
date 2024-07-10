import React from 'react';
import Image from 'next/image';

export default function DekstopProfileScreen() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-200 to-blue-200 text-gray-800">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Image
            src="https://via.placeholder.com/200"
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full border-4 border-green-500"
            width={128}
            height={128}
          />
          <div className="ml-6">
            <h1 className="text-4xl font-bold text-green-600">John Doe</h1>
            <p className="text-gray-600">Innovative Thinker at PulseZest</p>
          </div>
        </div>
        <div>
          <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors mr-2">Edit Profile</button>
          <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Settings</button>
        </div>
      </header>
      
      <main className="flex space-x-8">
        <section className="bg-white rounded-lg shadow p-6 flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-green-600">About Me</h2>
            <p className="text-gray-700">Creative mind with a passion for innovation and technology. Always eager to explore new challenges and opportunities.</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-green-600">Skills</h2>
            <ul className="list-none p-0 grid grid-cols-2 gap-4">
              <li className="bg-green-100 text-green-700 rounded-lg px-3 py-1">Creative Design</li>
              <li className="bg-green-100 text-green-700 rounded-lg px-3 py-1">Problem Solving</li>
              <li className="bg-green-100 text-green-700 rounded-lg px-3 py-1">Web Development</li>
              <li className="bg-green-100 text-green-700 rounded-lg px-3 py-1">Project Management</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-600">Contact</h2>
            <p className="text-gray-700">Email: johndoe@pulsezest.com</p>
            <p className="text-gray-700">Phone: (123) 456-7890</p>
          </div>
        </section>

        <aside className="bg-white rounded-lg shadow p-6 w-80">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Recent Activity</h2>
          <ul className="list-none p-0 space-y-4">
            <li className="bg-green-100 text-green-700 rounded-lg px-3 py-2">
              <p className="font-semibold">Project A</p>
              <p className="text-sm">Completed the initial design phase.</p>
            </li>
            <li className="bg-green-100 text-green-700 rounded-lg px-3 py-2">
              <p className="font-semibold">Project B</p>
              <p className="text-sm">Implemented new features based on feedback.</p>
            </li>
            <li className="bg-green-100 text-green-700 rounded-lg px-3 py-2">
              <p className="font-semibold">Project C</p>
              <p className="text-sm">Started the development phase.</p>
            </li>
          </ul>
        </aside>
      </main>
      
      <footer className="text-center mt-8">
        <p className="text-gray-600">&copy; 2024 PulseZest. All rights reserved.</p>
      </footer>
    </div>
  );
}
