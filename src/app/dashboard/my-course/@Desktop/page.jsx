'use client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaChevronDown, FaChevronUp, FaVideo } from 'react-icons/fa'; // Add FaCheck for completed tick
import VanillaTilt from 'vanilla-tilt';
import { auth, db } from '../../../../utils/Firebase/firebaseConfig';

const DesktopMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTopicDescription, setSelectedTopicDescription] = useState("");
  const [selectedVideoDescription, setSelectedVideoDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const tiltRefs = useRef([]);
  const videoRef = useRef(null);
  const userUid = useRef(null);

  useEffect(() => {
    const initializeTilt = () => {
      if (tiltRefs.current) {
        tiltRefs.current.forEach((el) => {
          if (el) {
            VanillaTilt.init(el, {
              max: 25,
              speed: 400,
            });
          }
        });
      }
    };

    initializeTilt();
    return () => {
      if (tiltRefs.current) {
        tiltRefs.current.forEach((el) => {
          if (el && el.vanillaTilt) {
            el.vanillaTilt.destroy();
          }
        });
      }
    };
  }, [courses]);

  useEffect(() => {
    const fetchUserCourses = async (uid) => {
      try {
        const userCoursesRef = collection(db, 'users', uid, 'courses');
        const userCoursesSnapshot = await getDocs(userCoursesRef);
        const courseIds = userCoursesSnapshot.docs.map(doc => doc.id);

        const coursePromises = courseIds.map(async (courseId) => {
          const courseDoc = await getDoc(doc(db, 'courses', courseId));
          const courseData = courseDoc.data();
          const { name, description, thumbnail, chapters } = courseData;

          const updatedChapters = await Promise.all(chapters.map(async (chapter) => {
            const topics = await Promise.all(chapter.topics.map(async (topic) => {
              return {
                ...topic,
                videoLinks: topic.videoLinks || []
              };
            }));
            return { ...chapter, topics };
          }));

          return { id: courseDoc.id, name, description, thumbnail, chapters: updatedChapters };
        });

        const courseList = await Promise.all(coursePromises);
        setCourses(courseList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses: ", error);
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        userUid.current = user.uid;
        fetchUserCourses(user.uid);
      } else {
        setCourses([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchVideoProgress = async (courseId) => {
    try {
      const videoProgressDoc = await getDoc(doc(db, 'users', userUid.current, 'courses', courseId, 'videoProgress', 'progress'));
      if (videoProgressDoc.exists()) {
        setVideoProgress(videoProgressDoc.data());
      } else {
        setVideoProgress({});
      }
    } catch (error) {
      console.error("Error fetching video progress: ", error);
    }
  };

  // Save video progress only if the progress is not already 100%
  const saveVideoProgress = async (courseId, videoLink, progress) => {
    if (videoProgress[videoLink] === 100) return; // Do not update progress if it's already 100%
    try {
      const videoProgressRef = doc(db, 'users', userUid.current, 'courses', courseId, 'videoProgress', 'progress');
      await setDoc(videoProgressRef, {
        ...videoProgress,
        [videoLink]: progress,
        completed: {
          ...videoProgress.completed,
          [videoLink]: progress === 100 ? true : videoProgress.completed ? videoProgress.completed[videoLink] : false,
        },
        lastWatched: videoLink
      });
      setVideoProgress(prevState => ({
        ...prevState,
        [videoLink]: progress,
        completed: {
          ...prevState.completed,
          [videoLink]: progress === 100
        },
        lastWatched: videoLink
      }));
    } catch (error) {
      console.error("Error saving video progress: ", error);
    }
  };

  const handlePause = () => {
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    const progress = (currentTime / duration) * 100;
    saveVideoProgress(selectedCourse.id, selectedVideo, progress);
  };

  const handleEnded = async () => {
    const currentChapter = selectedCourse.chapters.find((chapter) => 
      chapter.topics.some((topic) => topic.videoLinks.some((link) => link.link === selectedVideo))
    );
    const currentTopic = currentChapter.topics.find((topic) =>
      topic.videoLinks.some((link) => link.link === selectedVideo)
    );
    const videoIndex = currentTopic.videoLinks.findIndex((link) => link.link === selectedVideo);

    // Mark the video as 100% complete
    await saveVideoProgress(selectedCourse.id, selectedVideo, 100);

    // Move to the next video
    if (videoIndex < currentTopic.videoLinks.length - 1) {
      setSelectedVideo(currentTopic.videoLinks[videoIndex + 1].link);
    } else {
      // Move to the next topic or next chapter
      const topicIndex = currentChapter.topics.findIndex((topic) => topic === currentTopic);
      const chapterIndex = selectedCourse.chapters.findIndex((chapter) => chapter === currentChapter);

      if (topicIndex < currentChapter.topics.length - 1) {
        setSelectedVideo(currentChapter.topics[topicIndex + 1].videoLinks[0].link);
      } else if (chapterIndex < selectedCourse.chapters.length - 1) {
        setSelectedVideo(selectedCourse.chapters[chapterIndex + 1].topics[0].videoLinks[0].link);
      } else {
        setSelectedVideo(null); // No more chapters or topics left
      }
    }
  };

  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    setSelectedTopicDescription("");
    setSelectedVideoDescription("");
    await fetchVideoProgress(course.id);

    // Resume last watched video
    const lastWatchedVideo = videoProgress.lastWatched ? videoProgress.lastWatched : null;
    if (lastWatchedVideo) {
      setSelectedVideo(lastWatchedVideo);
    } else if (course.chapters.length > 0 && course.chapters[0].topics.length > 0 && course.chapters[0].topics[0].videoLinks.length > 0) {
      setSelectedVideo(course.chapters[0].topics[0].videoLinks[0].link);
    }
  };

  const toggleChapter = (chapterName) => {
    setExpandedChapters(prevState => ({
      ...prevState,
      [chapterName]: !prevState[chapterName]
    }));
  };

  const toggleTopic = (topicName) => {
    setExpandedTopics(prevState => ({
      ...prevState,
      [topicName]: !prevState[topicName]
    }));
  };

  const handleVideoSelect = async (videoLink, topicDescription, index) => {
    setSelectedVideo(videoLink.link);
    setSelectedTopicDescription(topicDescription);
    setSelectedVideoDescription(videoLink.description);
    videoRef.current.index = index;
    
    // Save new video's progress initially if not already present
    if (!videoProgress[videoLink.link]) {
      await saveVideoProgress(selectedCourse.id, videoLink.link, 0);  // Initialize with 0%
    }
    
    window.localStorage.setItem('currentVideo', videoLink.link);
  };

  useEffect(() => {
    const currentVideo = window.localStorage.getItem('currentVideo');
    if (currentVideo) {
      setSelectedVideo(currentVideo);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (selectedVideo && videoProgress[selectedVideo] !== undefined && videoProgress[selectedVideo] < 100) {
      const progress = videoProgress[selectedVideo];
      if (videoRef.current && videoRef.current.duration) {
        videoRef.current.currentTime = (videoRef.current.duration * progress) / 100;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (selectedVideo && videoProgress[selectedVideo] !== undefined && videoProgress[selectedVideo] < 100) {
      const progress = videoProgress[selectedVideo];
      if (videoRef.current && videoRef.current.duration) {
        videoRef.current.currentTime = (videoRef.current.duration * progress) / 100;
      }
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [selectedVideo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen p-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
          onClick={() => setSelectedCourse(null)}
        >
          Back to My Courses
        </button>
        <div className="flex space-x-4 mb-4">
          <h2 className="text-3xl font-bold">{selectedCourse.name}</h2>
        </div>
        <div className="flex space-x-6">
          <div className="w-2/3 p-4 rounded-lg shadow-lg relative bg-white">
            {selectedVideo ? (
              <>
                <video
                  key={selectedVideo}
                  src={selectedVideo}
                  controls
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  controlsList="nodownload noremoteplayback noplaybackrate noautohide"
                  ref={videoRef}
                  onPause={handlePause}
                  onEnded={handleEnded}
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
                <h1 className="font-bold text-2xl mt-4">Description</h1>
                {selectedVideoDescription && (
                  <div
                    style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}
                    dangerouslySetInnerHTML={{ __html: selectedVideoDescription }}
                  />
                )}
              </>
            ) : (
              <p className="text-gray-400">Select a video to play</p>
            )}
          </div>
          <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
            {selectedCourse.chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="mb-6">
                <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleChapter(chapter.chapterName)}>
                  <h3 className="text-xl font-semibold">{chapter.chapterName}</h3>
                  {expandedChapters[chapter.chapterName] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {(expandedChapters[chapter.chapterName] || chapterIndex === 0) && (
                  <div>
                    {chapter.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="mb-4">
                        <div
                          className={`flex justify-between items-center p-2 ${topicIndex === 0 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'} rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-300`}
                          onClick={() => toggleTopic(topic.topicName)}
                        >
                          <div className="flex items-center space-x-2">
                            <FaVideo className="text-blue-400" />
                            <h4 className="text-lg font-semibold flex-grow">{topic.topicName}</h4>
                          </div>
                          <span>{topic.videoLinks.length} videos</span>
                          {expandedTopics[topic.topicName] ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {expandedTopics[topic.topicName] && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm text-gray-400">{topic.topicDescription}</p>
                            {topic.videoLinks.map((videoLink, videoIndex) => (
                              <div
                                key={videoIndex}
                                className="p-2 bg-gray-700 text-gray-300 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-300"
                                onClick={() => handleVideoSelect(videoLink, topic.topicDescription, videoIndex)}
                              >
                                <div className="flex justify-between">
                                  <h5 className="text-md font-semibold">Video {videoIndex + 1}</h5>
                                  {videoProgress.completed && videoProgress.completed[videoLink.link] && (
                                    <FaCheck className="text-green-500" /> 
                                  )}
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
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-6xl font-bold text-black mb-12 text-center">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div
            key={course.id}
            ref={(el) => (tiltRefs.current[index] = el)}
            className="tilt bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-transform duration-300 relative"
            style={{ perspective: 1000 }}
          >
            <div className="relative">
              <Image
                src={course.thumbnail || "https://via.placeholder.com/600x400"}
                alt={course.name}
                className="object-cover rounded-lg mb-4"
                width={600}
                height={400}
                unoptimized
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xl font-bold">{60}% Complete</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              60% complete
            </div>
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Development
            </div>
            <div className="absolute bottom-4 left-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Intermediate
            </div>
            <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: '60%', transition: 'width 1s' }}
              ></div>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full w-full text-center font-semibold hover:bg-blue-600 transition-colors duration-300"
              onClick={() => handleCourseClick(course)}
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