import React from 'react';
import Image from 'next/image';

export default function PhoneProfileScreen() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
      <header className="text-center mb-6">
        <Image
          src="https://via.placeholder.com/150"
          alt="Profile Avatar"
          className="w-24 h-24 rounded-full border-4 border-green-500 mx-auto"
          width={96}
          height={96}
        />
        <h1 className="mt-4 text-2xl font-bold text-green-600">John Doe</h1>
        <p className="text-gray-600">Innovative Thinker at PulseZest</p>
      </header>
      
      <section className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-green-600">About Me</h2>
          <p className="text-gray-700">Creative mind with a passion for innovation and technology. Always eager to explore new challenges and opportunities.</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-green-600">Skills</h2>
          <ul className="list-none p-0">
            <li className="bg-green-100 text-green-700 rounded-lg px-3 py-1 mb-2">Creative Design</li>
            <li className="bg-green-100 text-green-700 rounded-lg px-3 py-1 mb-2">Problem Solving</li>
            <li className="bg-green-100 text-green-700 rounded-lg px-3 py-1 mb-2">Web Development</li>
            <li className="bg-green-100 text-green-700 rounded-lg px-3 py-1 mb-2">Project Management</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-green-600">Contact</h2>
          <p className="text-gray-700">Email: johndoe@pulsezest.com</p>
          <p className="text-gray-700">Phone: (123) 456-7890</p>
        </div>
      </section>
      
      <footer className="text-center">
        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors mr-2">Edit Profile</button>
        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Settings</button>
      </footer>
    </div>
  );
}
