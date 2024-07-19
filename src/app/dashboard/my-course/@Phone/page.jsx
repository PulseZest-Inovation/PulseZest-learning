'use client';
import { useRouter } from 'next/navigation';
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

export default function PhoneMyCourses() {
  const router = useRouter();

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">My Courses</h1>
        <button
          onClick={handleNotificationClick}
          className="text-blue-600 font-semibold"
        >
          Notifications
        </button>
      </header>

      <main className="p-4 space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-2 relative"
          >
            <Image
              src={course.thumbnail}
              alt={course.title}
              width={200}
              height={120}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-blue-600">{course.title}</h2>
            <p className="text-gray-700 text-center">{course.description}</p>
            <div className="flex justify-between w-full text-xs mt-2">
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full">{course.progress}% Complete</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded-full">{course.category}</span>
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">{course.level}</span>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-full mt-4 w-full font-semibold hover:bg-blue-700 transition-colors duration-300"
              onClick={() => alert(`Starting ${course.title}`)}
            >
              Start Learning
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
