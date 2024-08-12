'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs,getDoc,doc } from 'firebase/firestore';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import Image from 'next/image';

const MyCoursesPage = () => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserCourses = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    router.push('/login');
                    return;
                }
                const userCoursesRef = collection(db, 'users', user.uid, 'courses');
                const userCoursesSnapshot = await getDocs(userCoursesRef);
                const courseIds = userCoursesSnapshot.docs.map((doc) => doc.id);

                const coursePromises = courseIds.map(async (courseId) => {
                    const courseDoc = await getDoc(doc(db, 'courses', courseId));
                    if (!courseDoc.exists()) return null;

                    const courseData = courseDoc.data();
                    return {
                        id: courseDoc.id,
                        name: courseData.name || 'Unnamed Course',
                        description: courseData.description || 'No description available',
                        thumbnail: courseData.thumbnail || 'https://via.placeholder.com/600x400',
                        completionPercentage: courseData.completionPercentage || 0
                    };
                });

                const courseList = (await Promise.all(coursePromises)).filter(course => course !== null);
                setCourses(courseList);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Error fetching courses');
            } finally {
                setLoading(false);
            }
        };

        fetchUserCourses();
    }, [router]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
            <header className="flex justify-between items-center p-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-blue-600">My Courses</h1>
            </header>

            <main className="p-4 pb-[calc(60px+1rem)]">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-2 relative"
                    >
                        <Image
                            src={course.thumbnail}
                            alt={course.name}
                            width={200}
                            height={120}
                            className="w-full h-33 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-xl font-semibold text-blue-600">{course.name}</h2>
                        <p className="text-gray-700 text-center">{course.description}</p>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-full mt-4 w-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                            onClick={() => router.push(`/courses/${course.id}`)}
                        >
                            Start Learning
                        </button>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default MyCoursesPage;
