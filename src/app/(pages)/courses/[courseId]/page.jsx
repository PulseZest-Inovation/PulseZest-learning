'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db, auth } from '../../../../utils/Firebase/firebaseConfig';
import { useRouter, useParams } from 'next/navigation';  // Import useParams for route parameters
import { FaChevronDown, FaChevronUp, FaVideo, FaCheck, FaLock } from 'react-icons/fa';

const VideoSelector = () => {
    const { courseId } = useParams();  // Access courseId from useParams
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [userUid, setUserUid] = useState(null);
    const [completedVideos, setCompletedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);  // Add state for selectedVideo
    const router = useRouter();  // Use router for navigation

    useEffect(() => {
        if (!courseId) {
            setError('Course ID is not available');
            setLoading(false);
            return;
        }

        const getUserUid = () => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserUid(user.uid);
                    fetchCourseData(courseId, user.uid);
                } else {
                    setUserUid(null);
                    setLoading(false);
                    router.push('/dashboard/profile');
                }
            });
        };
        getUserUid();
    }, [courseId, router]);

    const fetchCourseData = async (courseId, uid) => {
        try {
            setLoading(true);
            console.log('Fetching course data for courseId:', courseId);
            const courseDoc = await getDoc(doc(db, 'courses', courseId));
            
            if (!courseDoc.exists()) {
                throw new Error('Course not found');
            }

            const courseData = courseDoc.data();
            const { name, description, thumbnail, chapters = [], courseLevel } = courseData;

            const updatedChapters = await Promise.all(
                chapters.map(async (chapter, chapterIndex) => {
                    const topics = await Promise.all(
                        chapter.topics.map(async (topic, topicIndex) => ({
                            ...topic,
                            id: `topic-${chapterIndex + 1}-${topicIndex + 1}`,
                            videoLinks: (topic.videoLinks || []).map((video, videoIndex) => ({
                                ...video,
                                id: `video-${chapterIndex + 1}-${topicIndex + 1}-${videoIndex + 1}`,
                            }))
                        }))
                    );
                    return {
                        chapterName: chapter.chapterName,
                        topics,
                        id: `chapter-${chapterIndex + 1}`,
                    };
                })
            );

            setSelectedCourse({
                id: courseDoc.id,
                name: name || 'Unnamed Course',
                description: description || 'No description available',
                thumbnail: thumbnail || 'https://via.placeholder.com/600x400',
                chapters: updatedChapters,
                courseLevel: courseLevel || 'Not Specified',
            });

            await fetchVideoProgress(courseId, uid);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching course data:', err);
            setError('Error fetching course data');
            setLoading(false);
        }
    };

    const fetchVideoProgress = async (courseId, uid) => {
        try {
            console.log('Fetching video progress for courseId:', courseId, 'userUid:', uid);
            const videoProgressCollection = collection(db, 'users', uid, 'courses', courseId, 'videoProgress');
            const videoProgressSnapshot = await getDocs(videoProgressCollection);
            const progressData = {};
            const completedVideosList = videoProgressSnapshot.docs
                .filter((doc) => doc.data().fullWatched)
                .map((doc) => {
                    progressData[doc.id] = doc.data().progress;
                    return doc.id;
                });
            setCompletedVideos(completedVideosList);
        } catch (error) {
            console.error('Error fetching video progress:', error);
        }
    };

    const toggleChapter = (chapterName) => {
        setExpandedChapters((prevState) => ({
            ...prevState,
            [chapterName]: !prevState[chapterName],
        }));
    };

    const toggleTopic = (chapterName, topicName) => {
        setExpandedTopics((prevState) => ({
            ...prevState,
            [`${chapterName}-${topicName}`]: !prevState[`${chapterName}-${topicName}`],
        }));
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);  // Set selected video
        const videoLinks = selectedCourse.chapters.flatMap(chapter => 
            chapter.topics.flatMap(topic => topic.videoLinks)
        );
        const initialIndex = videoLinks.findIndex(v => v.id === video.id);
        
        localStorage.setItem('currentVideoIndex', initialIndex);
        localStorage.setItem('videoLinks', JSON.stringify(videoLinks));
        
        router.push(`/courses/${courseId}/video/${video.id}`);
    };

    const canWatch = (video) => {
        // Add logic to determine if the video can be watched
        return true;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!selectedCourse) {
        return <div>No course data available</div>;
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4" onClick={() => router.push('/courses')}>
                Back to My Courses
            </button>
            <div className="flex flex-col space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 text-center">{selectedCourse.name}</h2>
                <div className="flex flex-col space-y-4">
                    {selectedCourse.chapters.map((chapter) => (
                        <div key={chapter.id} className="bg-white p-4 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleChapter(chapter.chapterName)}>
                                <h3 className="text-xl font-semibold text-gray-800">{chapter.chapterName}</h3>
                                {expandedChapters[chapter.chapterName] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                            </div>
                            {expandedChapters[chapter.chapterName] && (
                                <div>
                                    {chapter.topics.map((topic) => (
                                        <div key={topic.id} className="mb-4">
                                            <div
                                                className={`flex justify-between items-center p-2 ${expandedTopics[`${chapter.chapterName}-${topic.topicName}`] ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-200'} rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-300`}
                                                onClick={() => toggleTopic(chapter.chapterName, topic.topicName)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <FaVideo className="text-blue-400" />
                                                    <h4 className="text-lg font-semibold">{topic.topicName}</h4>
                                                </div>
                                                <span>{topic.videoLinks.length} videos</span>
                                                {expandedTopics[`${chapter.chapterName}-${topic.topicName}`] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                                            </div>
                                            {expandedTopics[`${chapter.chapterName}-${topic.topicName}`] && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-600">{topic.topicDescription}</p>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {topic.videoLinks.map((video) => (
                                                            <div
                                                                key={video.id}
                                                                className={`p-2 rounded-lg cursor-pointer transition-colors duration-300 ${selectedVideo?.link === video.link
                                                                        ? 'bg-blue-700 text-white border-2 border-blue-500'
                                                                        : !canWatch(video)
                                                                            ? 'bg-gray-500 text-gray-400 cursor-not-allowed'
                                                                            : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
                                                                    }`}
                                                                onClick={() => handleVideoClick(video)}
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <h5 className="text-md font-semibold">Video</h5>
                                                                    {completedVideos.includes(video.id) && <FaCheck className="ml-2 text-green-500" />}
                                                                    {!canWatch(video) && <FaLock className="ml-2 text-red-500" />}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoSelector;