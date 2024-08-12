'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../utils/Firebase/firebaseConfig';

const VideoPlayerPage = ({ params }) => {
    const router = useRouter();
    const { videoId } = params;
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const videoDoc = await getDoc(doc(db, 'videos', videoId));
                if (!videoDoc.exists()) {
                    setError('Video not found');
                    return;
                }

                setVideo(videoDoc.data());
            } catch (error) {
                console.error('Error fetching video data:', error);
                setError('Error fetching video data');
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, [videoId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4" onClick={() => router.back()}>
                Back to Course
            </button>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800">{video.title}</h2>
                <div className="mt-4">
                    <video controls className="w-full" src={video.videoUrl} />
                </div>
                <p className="mt-4 text-gray-700">{video.description}</p>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
