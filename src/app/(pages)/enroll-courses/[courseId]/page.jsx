'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';
import { FaChevronDown, FaChevronUp, FaVideo, FaCheck, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const VideoPlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoDescription, setSelectedVideoDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // Default playback speed
  const videoRef = useRef(null);
  const router = useRouter();
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const getUserUid = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUserUid(user.uid);
        } else {
          // User is signed out
          setUserUid(null);
          router.push('/login'); // Redirect to login page or any other handling
        }
      });
    };

    getUserUid();
  }, [router]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !userUid) {
        setError('Course ID or User ID is missing');
        setLoading(false);
        return;
      }

      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (!courseDoc.exists()) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        const courseData = courseDoc.data();
        const { name, description, thumbnail, chapters = [], courseLevel } = courseData;

        const updatedChapters = await Promise.all(
          chapters.map(async (chapter) => {
            const topics = await Promise.all(
              chapter.topics.map(async (topic) => ({
                ...topic,
                videoLinks: topic.videoLinks || []
              }))
            );
            return {
              chapterName: chapter.chapterName,
              topics,
              id: chapter.id
            };
          })
        );

        setCourse({
          id: courseDoc.id,
          name: name || 'Unnamed Course',
          description: description || 'No description available',
          thumbnail: thumbnail || 'https://via.placeholder.com/600x400',
          chapters: updatedChapters,
          courseLevel: courseLevel || 'Not Specified'
        });

        const userProgressRef = doc(db, 'users', userUid, 'courses', courseId);
        const userProgressDoc = await getDoc(userProgressRef);
        const progressData = userProgressDoc.exists() ? userProgressDoc.data().videoProgress : {};

        setVideoProgress(progressData);

        const lastWatchedVideoLink = userProgressDoc.exists() ? userProgressDoc.data().lastWatched : null;

        if (lastWatchedVideoLink) {
          const lastWatchedVideo = findVideoByLink(lastWatchedVideoLink, updatedChapters);
          if (lastWatchedVideo) {
            setSelectedVideo(lastWatchedVideo);
            setSelectedVideoDescription(lastWatchedVideo.description || 'No description available');
            if (videoRef.current) {
              videoRef.current.currentTime = progressData[lastWatchedVideoLink]?.time || 0;
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Error fetching course data');
        setLoading(false);
      }
    };

    if (userUid) {
      fetchCourseData();
    }
  }, [courseId, userUid]);

  useEffect(() => {
    if (videoProgress && selectedVideo) {
      const savedProgress = videoProgress[selectedVideo.link];
      if (savedProgress) {
        videoRef.current.currentTime = savedProgress.time || 0;
      }
    }
  }, [selectedVideo, videoProgress]);

  const findVideoByLink = (link, chapters) => {
    for (const chapter of chapters || course?.chapters || []) {
      for (const topic of chapter.topics || []) {
        const video = topic.videoLinks.find(v => v.link === link);
        if (video) return video;
      }
    }
    return null;
  };

  const isUnlocked = (chapterIndex, topicIndex, videoIndex) => {
    for (let i = 0; i <= chapterIndex; i++) {
      for (let j = 0; j < (i === chapterIndex ? topicIndex : course.chapters[i].topics.length); j++) {
        for (let k = 0; k < (i === chapterIndex && j === topicIndex ? videoIndex : course.chapters[i].topics[j].videoLinks.length); k++) {
          const video = course.chapters[i].topics[j].videoLinks[k];
          if (!videoProgress?.[video.link]?.completed) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleVideoClick = (video, chapterIndex, topicIndex, videoIndex) => {
    if (!isUnlocked(chapterIndex, topicIndex, videoIndex)) {
      alert("Please watch the previous videos completely before proceeding to the next one.");
      return;
    }
    setSelectedVideo(video);
    setSelectedVideoDescription(video.description || 'No description available');
    if (videoRef.current && videoProgress[video.link]) {
      videoRef.current.currentTime = videoProgress[video.link].time;
    }
  };

  const toggleChapter = (chapterName) => {
    setExpandedChapters((prevState) => ({
      ...prevState,
      [chapterName]: !prevState[chapterName]
    }));
  };

  const toggleTopic = (chapterName, topicName) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [`${chapterName}-${topicName}`]: !prevState[`${chapterName}-${topicName}`]
    }));
  };

  const unlockNextVideo = async () => {
    const currentChapterIndex = course.chapters.findIndex(chapter => 
      chapter.topics.some(topic => 
        topic.videoLinks.some(video => video.link === selectedVideo.link)
      )
    );
    const currentTopicIndex = course.chapters[currentChapterIndex].topics.findIndex(topic => 
      topic.videoLinks.some(video => video.link === selectedVideo.link)
    );
    const currentVideoIndex = course.chapters[currentChapterIndex].topics[currentTopicIndex].videoLinks.findIndex(video => video.link === selectedVideo.link);

    const nextVideoIndex = currentVideoIndex + 1;
    if (nextVideoIndex < course.chapters[currentChapterIndex].topics[currentTopicIndex].videoLinks.length) {
      const nextVideo = course.chapters[currentChapterIndex].topics[currentTopicIndex].videoLinks[nextVideoIndex];
      setSelectedVideo(nextVideo);
      setSelectedVideoDescription(nextVideo.description || 'No description available');
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    } else {
      const nextTopicIndex = currentTopicIndex + 1;
      if (nextTopicIndex < course.chapters[currentChapterIndex].topics.length) {
        const nextTopic = course.chapters[currentChapterIndex].topics[nextTopicIndex];
        if (nextTopic.videoLinks.length > 0) {
          const nextVideo = nextTopic.videoLinks[0];
          setSelectedVideo(nextVideo);
          setSelectedVideoDescription(nextVideo.description || 'No description available');
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
          }
        }
      } else {
        const nextChapterIndex = currentChapterIndex + 1;
        if (nextChapterIndex < course.chapters.length) {
          const nextChapter = course.chapters[nextChapterIndex];
          if (nextChapter.topics.length > 0) {
            const nextTopic = nextChapter.topics[0];
            if (nextTopic.videoLinks.length > 0) {
              const nextVideo = nextTopic.videoLinks[0];
              setSelectedVideo(nextVideo);
              setSelectedVideoDescription(nextVideo.description || 'No description available');
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
              }
            }
          }
        }
      }
    }
  };

  const saveVideoProgress = async (userUid, courseId, videoLink, progress) => {
    console.log('Saving video progress...');

    try {
      // Create a reference to the progress document
      const videoProgressRef = doc(db, 'users', userUid, 'courses', courseId, 'videoProgress', 'progress');

      // Fetch existing video progress data
      const docSnap = await getDoc(videoProgressRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};

      // Check if current video progress exists and is already completed
      if (existingData[videoLink]?.completed) return;

      // Update the progress data
      const updatedData = {
        ...existingData,
        [videoLink]: {
          ...progress,
          completed: progress.progress === 100,
        },
        lastWatched: videoLink,
      };

      // Save the updated progress data to Firestore
      await setDoc(videoProgressRef, updatedData, { merge: true });

      console.log('Video progress saved successfully');
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  };

  const handleProgressUpdate = (event) => {
    const currentTime = event.target.currentTime;
    const duration = event.target.duration;
    const progress = (currentTime / duration) * 100;

    if (selectedVideo && selectedVideo.link) {
      const videoLink = selectedVideo.link;
      saveVideoProgress(userUid, courseId, videoLink, { time: currentTime, progress });
      
      // Check if video is finished and play next video
      if (progress === 100) {
        saveVideoProgress(userUid, courseId, videoLink, { time: currentTime, progress }); // Save progress on 100% completion
        unlockNextVideo();
      }
    }
  };

  const handleBackToCourses = () => {
    router.push(`/dashboard/my-courses`);
  };

  const handlePlaybackSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>No course data available</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4" onClick={handleBackToCourses}>
        Back to My Courses
      </button>
      <div className="flex space-x-4 mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{course.name}</h2>
      </div>
      <div className="flex space-x-6">
        <div className="w-2/3 p-4 rounded-lg shadow-lg relative bg-white">
          {selectedVideo ? (
            <>
              <video
                key={selectedVideo.link}
                src={selectedVideo.link}
                controls
                className={`w-full h-64 object-cover rounded-lg shadow-lg ${selectedVideo ? 'border-2 border-blue-500' : ''}`}
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                controlsList="nodownload noremoteplayback noplaybackrate noautohide"
                ref={videoRef}
                autoPlay
                onPause={handleProgressUpdate}
                onEnded={() => {
                  saveVideoProgress(userUid, courseId, selectedVideo.link, { time: videoRef.current.currentTime, progress: 100 });
                  unlockNextVideo();
                }}
              >
                Your browser does not support the video tag.
              </video>

              <div className="flex items-center mt-4">
                <button className="bg-gray-200 px-4 py-2 rounded-full" onClick={() => handlePlaybackSpeedChange(0.5)}>
                  0.5x
                </button>
                <button className="bg-gray-200 px-4 py-2 rounded-full mx-2" onClick={() => handlePlaybackSpeedChange(1.0)}>
                  1x
                </button>
                <button className="bg-gray-200 px-4 py-2 rounded-full" onClick={() => handlePlaybackSpeedChange(1.5)}>
                  1.5x
                </button>
                <button className="bg-gray-200 px-4 py-2 rounded-full" onClick={() => handlePlaybackSpeedChange(2.0)}>
                  2x
                </button>
              </div>

              <h1 className="font-bold text-2xl mt-4 text-gray-800">Description</h1>
              {selectedVideoDescription && (
                <div
                  style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px', backgroundColor: '#f9f9f9' }}
                  dangerouslySetInnerHTML={{ __html: selectedVideoDescription }}
                />
              )}
            </>
          ) : (
            <p className="text-gray-500">Select a video to play</p>
          )}
        </div>
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
          {course.chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="mb-6">
              <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleChapter(chapter.chapterName)}>
                <h3 className="text-xl font-semibold text-gray-800">{chapter.chapterName}</h3>
                {expandedChapters[chapter.chapterName] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </div>
              {expandedChapters[chapter.chapterName] && (
                <div>
                  {chapter.topics.map((topic, topicIndex) => (
                    <div key={topic.topicName} className="mb-4">
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
                        <div className="mt-2 space-y-2">
                          <p className="text-sm text-gray-600">{topic.description}</p>
                          {topic.videoLinks.map((video, videoIndex) => (
                            <div
                              key={video.link}
                              className={`p-2 rounded-lg cursor-pointer transition-colors duration-300 ${selectedVideo?.link === video.link ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
                              onClick={() => handleVideoClick(video, chapterIndex, topicIndex, videoIndex)}
                            >
                              <div className="flex justify-between items-center">
                                <h5 className="text-md font-semibold">
                                  Video {videoIndex + 1}
                                  {videoProgress?.[video.link]?.completed && <FaCheck className="ml-2 text-green-500" />}
                                  {!isUnlocked(chapterIndex, topicIndex, videoIndex) && <FaLock className="ml-2 text-red-500" />}
                                </h5>
                              </div>
                            </div>
                          ))}
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

export default VideoPlayer;