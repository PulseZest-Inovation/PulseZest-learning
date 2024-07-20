'use client';

import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../../utils/Firebase/firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Transition } from '@headlessui/react';
import { FaPlay, FaVideo, FaMoon, FaSun, FaHome, FaSearch } from 'react-icons/fa';

const LearningAreaScreenLayout = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCourses = async (uid) => {
            try {
                const coursesRef = collection(db, 'users', uid, 'courses');
                const coursesSnapshot = await getDocs(coursesRef);
                const courseIds = coursesSnapshot.docs.map(doc => doc.id);

                const coursesData = [];
                for (const courseId of courseIds) {
                    const courseDoc = doc(db, 'courses', courseId);
                    const courseSnapshot = await getDoc(courseDoc);
                    if (courseSnapshot.exists()) {
                        coursesData.push({
                            id: courseId,
                            ...courseSnapshot.data()
                        });
                    }
                }

                setCourses(coursesData);
            } catch (error) {
                console.error("Error fetching courses: ", error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchCourses(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setSelectedTopic(null);
    };

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        document.documentElement.classList.toggle('dark', newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode !== darkMode) {
            setDarkMode(savedDarkMode);
            document.documentElement.classList.toggle('dark', savedDarkMode);
        }
    }, [darkMode]);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-gray-600">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
            <div className="flex">
                {/* Sidebar for Courses */}
                <Transition
                    show={true}
                    enter="transition-transform duration-500"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition-transform duration-500"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div
                        className={`w-1/4 p-4 shadow-lg rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
                        style={{ overflowY: 'auto' }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Courses</h2>
                            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-600 hover:bg-gray-500">
                                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-300" />}
                            </button>
                        </div>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full p-2 rounded-lg shadow-inner focus:outline-none"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <FaSearch className="absolute top-2 right-3 text-gray-500" />
                        </div>
                        {courses.length === 0 ? (
                            <p className="text-gray-400">No courses available</p>
                        ) : (
                            courses
                                .filter((course) => course.name.toLowerCase().includes(searchQuery))
                                .map((course, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 p-3 rounded-lg cursor-pointer transition-transform duration-300 transform hover:scale-105 ${selectedCourse?.id === course.id ? 'bg-blue-700 border-l-4 border-blue-400' : 'hover:bg-gray-700'}`}
                                        onClick={() => handleCourseClick(course)}
                                    >
                                        <img src={course.thumbnail || 'https://via.placeholder.com/150'} alt={course.name} className="w-full h-32 object-cover rounded-md mb-2" />
                                        <h3 className="text-lg font-bold">{course.name}</h3>
                                    </div>
                                ))
                        )}
                    </div>
                </Transition>

                {/* Main Content Area */}
                <div className="w-3/4 p-4 flex flex-col space-y-4" style={{ overflowY: 'auto' }}>
                    {selectedCourse ? (
                        <div className="flex-grow">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-3xl font-bold">{selectedCourse.courseName}</h2>
                                <Breadcrumbs course={selectedCourse.courseName} />
                            </div>
                            <div className="flex space-x-6">
                                {/* Video Player */}
                                <div className="w-2/3 p-4 rounded-lg shadow-lg relative">
                                    {selectedTopic ? (
                                        selectedTopic.videoLinks.length > 0 ? (
                                            selectedTopic.videoLinks.map((videoLink, videoIndex) => (
                                                <div key={videoIndex} className="mb-4">
                                                    <video
                                                        controls
                                                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                                                        disablePictureInPicture
                                                        onContextMenu={(e) => e.preventDefault()}
                                                        controlsList="nodownload noremoteplayback noplaybackrate noautohide"
                                                        onPlay={(e) => {
                                                            const video = e.target;
                                                            video.addEventListener('timeupdate', () => {
                                                                if (video.currentTime > video.duration - 2) {
                                                                    video.currentTime = video.duration - 2;
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <source src={videoLink} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No videos available for this topic.</p>
                                        )
                                    ) : (
                                        <p className="text-gray-400">Select a topic to view its videos</p>
                                    )}
                                </div>

                                {/* Topics List */}
                                <div className="w-1/3 bg-gray-700 p-4 rounded-lg shadow-lg overflow-y-auto">
                                    {selectedCourse.chapters.map((chapter, chapterIndex) => (
                                        <div key={chapterIndex} className="mb-6">
                                            <h3 className="text-xl font-semibold mb-2">{chapter.chapterName}</h3>
                                            {chapter.topics.map((topic, topicIndex) => (
                                                <div
                                                    key={topicIndex}
                                                    className={`mb-2 p-2 rounded-lg cursor-pointer transition-colors duration-300 flex items-center space-x-2 ${selectedTopic?.topicName === topic.topicName ? 'bg-blue-600 text-gray-200' : 'bg-gray-600 text-gray-300'} hover:bg-blue-500 hover:text-white`}
                                                    onClick={() => handleTopicClick(topic)}
                                                >
                                                    <FaVideo className="text-blue-400" />
                                                    <h4 className="text-lg font-semibold flex-grow">{topic.topicName}</h4>
                                                    <span className="text-sm">{topic.videoLinks.length} videos</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">Select a course to view its details</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const Breadcrumbs = ({ course }) => (
    <nav className="bg-gray-900 rounded-md w-full mb-4">
        <ol className="list-reset flex text-white">
         
            <li><a href="#" className="text-gray-400">{course}</a></li>
        </ol>
    </nav>
);

export default LearningAreaScreenLayout;