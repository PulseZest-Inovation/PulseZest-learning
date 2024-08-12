'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import { FaChevronDown, FaChevronUp, FaVideo, FaCheck, FaLock } from 'react-icons/fa';

const CourseDetailPage = ({ params }) => {
    const router = useRouter();
    const { courseId } = params;
    const [course, setCourse] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completedVideos, setCompletedVideos] = useState([]);
    const [videoProgress, setVideoProgress] = useState({});
    const userUid = auth.currentUser?.uid;
    const videoRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    router.push('/login');
                    return;
                }

                // Fetch course data
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (!courseDoc.exists()) {
                    setError('Course not found');
                    return;
                }

                const courseData = courseDoc.data();
                const updatedChapters = await Promise.all(
                    courseData.chapters.map(async (chapter, chapterIndex) => {
                        const topics = await Promise.all(
                            chapter.topics.map(async (topic, topicIndex) => ({
                                ...topic,
                                id: `topic-${chapterIndex + 1}-${topicIndex + 1}`,
                                videoLinks: (topic.videoLinks || []).map((video, videoIndex) => ({
                                    ...video,
                                    number: videoIndex + 1 // Add a number for display purposes
                                }))
                            }))
                        );
                        return { ...chapter, topics };
                    })
                );

                setCourse({
                    id: courseDoc.id,
                    name: courseData.name || 'Unnamed Course',
                    chapters: updatedChapters,
                });

                // Fetch video progress
                const progressCollection = collection(db, 'users', userUid, 'courses', courseId, 'videoProgress');
                const progressSnapshot = await getDocs(progressCollection);
                const progressData = progressSnapshot.docs.reduce((acc, doc) => {
                    acc[doc.id] = doc.data();
                    return acc;
                }, {});

                setVideoProgress(progressData);
                setCompletedVideos(Object.keys(progressData).filter((key) => progressData[key].progress === 100));
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError('Error fetching course data');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId, router, userUid]);

    const saveVideoProgress = async (video, progress, fullWatched) => {
        if (!video || !userUid) {
            return;
        }

        const videoKey = `${video.link}-${video.number}`; // Create a unique key for each video
        const updatedProgress = {
            progress,
            fullWatched: fullWatched || progress === 100,
            updatedAt: new Date(),
        };

        const videoProgressRef = doc(db, 'users', userUid, 'courses', courseId, 'videoProgress', videoKey);
        await setDoc(videoProgressRef, updatedProgress, { merge: true });

        setVideoProgress((prev) => ({
            ...prev,
            [videoKey]: updatedProgress,
        }));

        if (progress === 100) {
            setCompletedVideos((prev) => [...prev, videoKey]);
        }
    };

    const handleVideoPause = () => {
        if (videoRef.current && selectedVideo) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            saveVideoProgress(selectedVideo, progress, progress === 100);
        }
    };

    const handleVideoEnded = () => {
        saveVideoProgress(selectedVideo, 100, true);
        const nextVideo = getNextVideo();
        if (nextVideo) {
            setSelectedVideo(nextVideo);
            updateLastWatchedVideo(nextVideo.link);
        }
    };

    const updateLastWatchedVideo = async (url) => {
        try {
            const lastWatchedRef = doc(db, 'users', userUid, 'courses', courseId, 'lastWatched');
            await setDoc(lastWatchedRef, { watched: url }, { merge: true });
        } catch (error) {
            console.error('Error updating last watched video:', error);
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

    const canWatch = (video, topic) => {
        // Check if any video in the topic is completed
        const isAnyVideoCompleted = topic.videoLinks.some(v => completedVideos.includes(`${v.link}-${v.number}`));
        return isAnyVideoCompleted || completedVideos.includes(`${video.link}-${video.number}`);
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        if (videoRef.current) {
            videoRef.current.play();
        }
        // Navigate to a new route based on video URL
        router.push(`/video?url=${encodeURIComponent(video.link)}&number=${video.number}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4" onClick={() => router.push('/courses')}>
                Back to My Courses
            </button>
            <div className="flex flex-col space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 text-center">{course?.name}</h2>
                <div className="flex flex-col space-y-4">
                    {course?.chapters.map((chapter) => (
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
                                                                key={`${video.link}-${video.number}`}
                                                                className={`p-2 rounded-lg cursor-pointer transition-colors duration-300 ${selectedVideo?.link === video.link && selectedVideo?.number === video.number
                                                                        ? 'bg-blue-700 text-white border-2 border-blue-500'
                                                                        : 'bg-gray-200 hover:bg-gray-300'} flex justify-between items-center`}
                                                                onClick={() => handleVideoClick(video)}
                                                            >
                                                                <span className="font-semibold">Video {video.number}</span>
                                                                {completedVideos.includes(`${video.link}-${video.number}`) ? <FaCheck className="text-green-500" /> : canWatch(video, topic) ? <FaLock className="text-gray-500" /> : null}
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
            {selectedVideo && (
                <div className="fixed bottom-0 left-0 right-0 bg-black p-4">
                    <video
                        ref={videoRef}
                        src={selectedVideo.link}
                        controls
                        onPause={handleVideoPause}
                        onEnded={handleVideoEnded}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
};

export default CourseDetailPage;
