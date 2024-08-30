import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, onSnapshot, query, where, getCountFromServer, setDoc, deleteDoc as firestoreDeleteDoc } from 'firebase/firestore';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineSend, AiOutlineLike, AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { Mention, MentionsInput, MentionComponent } from 'react-mentions';

const Comment = ({ courseId = '', chapterName = '', topicName = '', videoId = '' }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('Anonymous');
    const [userProfilePic, setUserProfilePic] = useState('');
    const [visibleComments, setVisibleComments] = useState(7);
    const [expandedComments, setExpandedComments] = useState({});
    const [userLikes, setUserLikes] = useState(new Set());
    const [currentUser, setCurrentUser] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [users, setUsers] = useState([]); // Store all users for mentions

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const user = auth.currentUser;
            setCurrentUser(user);

            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name || 'Anonymous');
                    setUserProfilePic(userDoc.data().profilePhoto || '');
                }
            }
        };

        fetchUserDetails();
    }, [auth, db]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);
            setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchUsers();
    }, [db]);

    useEffect(() => {
        const fetchUserLikes = async () => {
            const user = auth.currentUser;
            if (user) {
                const likesRef = collection(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'likes');
                const likesSnapshot = await getDocs(query(likesRef, where('userId', '==', user.uid)));
                const likedComments = new Set(likesSnapshot.docs.map(doc => doc.id));
                setUserLikes(likedComments);
            }
        };

        fetchUserLikes();
    }, [auth, db, courseId, chapterName, topicName, videoId]);

    useEffect(() => {
        if (!courseId || !chapterName || !topicName || !videoId) return;

        const commentsRef = collection(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments');
        const unsubscribeComments = onSnapshot(commentsRef, async (snapshot) => {
            const fetchedComments = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const likesRef = collection(doc.ref, 'likes');
                const likesSnapshot = await getCountFromServer(likesRef);

                const createdAt = data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date();

                // Fetch replies
                const repliesRef = collection(doc.ref, 'replies');
                const repliesSnapshot = await getDocs(repliesRef);
                const replies = await Promise.all(repliesSnapshot.docs.map(async (replyDoc) => {
                    const replyData = replyDoc.data();
                    return {
                        id: replyDoc.id,
                        text: replyData.text,
                        userName: replyData.userName,
                        userId: replyData.userId,
                        createdAt: new Date(replyData.createdAt.seconds * 1000),
                        profilePhoto: replyData.profilePhoto || '',
                    };
                }));

                return {
                    id: doc.id,
                    text: data.text,
                    userName: data.userName,
                    userId: data.userId,
                    edited: data.edited || false,
                    createdAt: createdAt,
                    profilePhoto: data.profilePhoto || '',
                    likes: likesSnapshot.data().count || 0,
                    replies: replies,
                };
            }));
            fetchedComments.sort((a, b) => b.likes - a.likes);
            setComments(fetchedComments);
        });

        return () => {
            unsubscribeComments();
        };
    }, [auth.currentUser, db, courseId, chapterName, topicName, videoId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) return;

        const user = auth.currentUser;
        if (user) {
            try {
                if (!courseId || !chapterName || !topicName || !videoId) {
                    throw new Error('Missing required parameters.');
                }

                const commentsRef = collection(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments');
                const newCommentData = {
                    text: newComment,
                    userId: user.uid,
                    userName: userName,
                    createdAt: serverTimestamp(),
                    profilePhoto: userProfilePic || '',
                    edited: false,
                    likes: 0,
                };

                const docRef = await addDoc(commentsRef, newCommentData);

                setComments((prevComments) => [
                    { ...newCommentData, id: docRef.id, createdAt: new Date() },
                    ...prevComments
                ]);

                setNewComment('');
            } catch (error) {
                console.error('Error adding comment:', error.message || error);
            }
        }
    };

    const handleLike = async (commentId) => {
        const user = auth.currentUser;
        if (user) {
            const commentRef = doc(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', commentId);
            const likesRef = collection(commentRef, 'likes');
            const userLikeRef = doc(likesRef, user.uid);

            if (userLikes.has(commentId)) {
                await firestoreDeleteDoc(userLikeRef);
                await updateDoc(commentRef, { likes: (await getCountFromServer(likesRef)).data().count - 1 });
                setUserLikes((prevLikes) => {
                    const newLikes = new Set(prevLikes);
                    newLikes.delete(commentId);
                    return newLikes;
                });
            } else {
                await setDoc(userLikeRef, { userId: user.uid });
                await updateDoc(commentRef, { likes: (await getCountFromServer(likesRef)).data().count + 1 });
                setUserLikes((prevLikes) => new Set(prevLikes).add(commentId));
            }
        }
    };

    const handleEdit = (commentId) => {
        const comment = comments.find(c => c.id === commentId);
        setEditingCommentId(commentId);
        setEditingCommentText(comment.text);
    };

    const handleSaveEdit = async (commentId) => {
        const commentRef = doc(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', commentId);
        await updateDoc(commentRef, { text: editingCommentText, edited: true });
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.id === commentId ? { ...comment, text: editingCommentText, edited: true } : comment
            )
        );
        setEditingCommentId(null);
        setEditingCommentText('');
    };

    const handleDelete = async (commentId) => {
        const commentRef = doc(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', commentId);
        await deleteDoc(commentRef);
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText || !replyToCommentId) return;

        const user = auth.currentUser;
        if (user) {
            try {
                const replyRef = collection(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', replyToCommentId, 'replies');
                const newReplyData = {
                    text: replyText,
                    userId: user.uid,
                    userName: userName,
                    createdAt: serverTimestamp(),
                    profilePhoto: userProfilePic || '',
                };

                await addDoc(replyRef, newReplyData);

                // Reset reply state
                setReplyText('');
                setReplyToCommentId(null);
            } catch (error) {
                console.error('Error adding reply:', error.message || error);
            }
        }
    };

    const renderProfilePic = (photoUrl) => {
        if (photoUrl) {
            return <img src={photoUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />;
        }
        return <FaUserCircle className="w-10 h-10 text-gray-400" />;
    };

    const toggleCommentExpand = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const renderCommentText = (comment) => {
        const isExpanded = expandedComments[comment.id];
        const text = comment.text || '';
        const lines = text.split('\n');
        const isLong = lines.length > 3;

        if (editingCommentId === comment.id) {
            return (
                <div>
                    <MentionsInput
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Edit your comment..."
                    >
                        <Mention
                            trigger="$"
                            data={users.map(user => ({ id: user.id, display: user.name }))}
                            displayTransform={(id, display) => `$${display}`}
                        />
                    </MentionsInput>
                    <div className="flex space-x-2 mt-2">
                        <button
                            onClick={() => handleSaveEdit(comment.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            );
        }

        if (isLong && !isExpanded) {
            return (
                <>
                    {lines.slice(0, 3).map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                    <button
                        onClick={() => toggleCommentExpand(comment.id)}
                        className="text-blue-500 hover:underline focus:outline-none"
                    >
                        Read More
                    </button>
                </>
            );
        }

        return (
            <>
                {lines.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
                {comment.edited && (
                    <p className="text-sm text-gray-400 italic">Edited</p>
                )}
                {isLong && (
                    <button
                        onClick={() => toggleCommentExpand(comment.id)}
                        className="text-blue-500 hover:underline focus:outline-none"
                    >
                        Show Less
                    </button>
                )}
            </>
        );
    };

    const renderReplies = (comment) => {
        return (
            <ul className="ml-6 mt-4 space-y-2">
                {comment.replies.map((reply) => (
                    <li key={reply.id} className="flex space-x-4">
                        {renderProfilePic(reply.profilePhoto)}
                        <div>
                            <p className="font-semibold text-gray-700">{reply.userName}</p>
                            <p className="text-gray-600">{reply.text}</p>
                            <p className="mt-1 text-sm text-gray-400">
                                {reply.createdAt.toLocaleString()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="mt-8 px-4 md:px-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Comments ({comments.length})
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-4 items-start">
                    {renderProfilePic(userProfilePic)}
                    <MentionsInput
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Add a comment..."
                    >
                        <Mention
                            trigger="$"
                            data={users.map(user => ({ id: user.id, display: user.name }))}
                            displayTransform={(id, display) => `$${display}`}
                        />
                    </MentionsInput>
                </div>
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <span>Comment</span>
                        <AiOutlineSend className="text-xl" />
                    </button>
                </div>
            </form>
            {loading ? (
                <p className="text-gray-500">Loading comments...</p>
            ) : (
                <ul className="space-y-4">
                    {comments.slice(0, visibleComments).map((comment) => (
                        <li key={comment.id} className="flex flex-col space-y-4">
                            <div className="flex space-x-4">
                                {renderProfilePic(comment.profilePhoto)}
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-700">{comment.userName}</p>
                                    <div className="mt-1 text-gray-600">{renderCommentText(comment)}</div>
                                    <p className="mt-1 text-sm text-gray-400">
                                        {comment.createdAt.toLocaleString()}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        {userLikes.has(comment.id) ? (
                                            <button
                                                onClick={() => handleLike(comment.id)}
                                                className="flex items-center text-blue-500"
                                            >
                                                <AiOutlineLike className="mr-1" /> {comment.likes}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleLike(comment.id)}
                                                className="flex items-center text-gray-500 hover:text-blue-500"
                                            >
                                                <AiOutlineLike className="mr-1" /> {comment.likes}
                                            </button>
                                        )}
                                        {comment.userId === currentUser?.uid && (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(comment.id)}
                                                    className="flex items-center text-gray-500 hover:text-green-500"
                                                >
                                                    <AiFillEdit className="mr-1" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="flex items-center text-gray-500 hover:text-red-500"
                                                >
                                                    <AiFillDelete className="mr-1" />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setReplyToCommentId(comment.id)}
                                            className="flex items-center text-gray-500 hover:text-blue-500"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                    {replyToCommentId === comment.id && (
                                        <form onSubmit={handleReplySubmit} className="mt-4">
                                            <div className="flex space-x-4 items-start">
                                                {renderProfilePic(userProfilePic)}
                                                <MentionsInput
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                                    placeholder="Add a reply..."
                                                >
                                                    <Mention
                                                        trigger="$"
                                                        data={users.map(user => ({ id: user.id, display: user.name }))}
                                                        displayTransform={(id, display) => `$${display}`}
                                                    />
                                                </MentionsInput>
                                            </div>
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    type="submit"
                                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <span>Reply</span>
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                    {comment.replies.length > 0 && renderReplies(comment)}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {comments.length > visibleComments && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setVisibleComments((prev) => prev + 7)}
                        className="text-blue-600 hover:underline focus:outline-none"
                    >
                        Read More Comments
                    </button>
                </div>
            )}
        </div>
    );
};

export default Comment;
