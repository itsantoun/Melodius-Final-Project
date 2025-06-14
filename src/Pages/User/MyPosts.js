// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AccountContext } from '../SignIn-SignUp/Account';
// import './MyPosts.css';
// import UserSidebar from './UserSidebar';

// const MyPosts = () => {
//     const [announcements, setAnnouncements] = useState([]);
//     const [posts, setPosts] = useState([]);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [activeTab, setActiveTab] = useState('announcements');
//     const { getSession } = useContext(AccountContext);

//     // Fetch user ID on component mount
//     useEffect(() => {
//         fetchUserId();
//     }, []);

//     // Fetch announcements and posts when user ID is set
//     useEffect(() => {
//         if (userId) {
//             fetchMyAnnouncements();
//             fetchMyPosts();
//         }
//     }, [userId]);

//     // Fetch user ID from session
//     const fetchUserId = async () => {
//         try {
//             const session = await getSession();
//             const userEmail = session.idToken.payload.email;

//             const response = await axios.get('http://localhost:3002/getUserId', {
//                 params: { email: userEmail },
//             });

//             if (response.status === 200 && response.data.user_id) {
//                 setUserId(response.data.user_id);
//             } else {
//                 throw new Error('User ID not found');
//             }
//         } catch (error) {
//             console.error('Error fetching user ID:', error);
//             setError('Failed to fetch user ID. Please try again later.');
//         }
//     };

//     // Fetch announcements for the logged-in user
//     const fetchMyAnnouncements = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3006/announcements/user`, {
//                 params: { user_id: userId },
//             });
//             setAnnouncements(response.data);
//         } catch (error) {
//             console.error('Error fetching announcements:', error);
//             setError('Failed to fetch announcements. Please try again later.');
//         }
//     };

//     // Fetch posts for the logged-in user
//     const fetchMyPosts = async () => {
//         try {
//             const response = await axios.get('http://localhost:3005/posts', {
//                 params: { user_id: userId },
//             });
//             setPosts(response.data);
//         } catch (error) {
//             console.error('Error fetching posts:', error);
//             setError('Failed to fetch posts. Please try again later.');
//         }
//     };

//     // Handle announcement deletion
//     const handleDeleteAnnouncement = async (postId) => {
//         const confirmed = window.confirm('Are you sure you want to delete this announcement?');
//         if (!confirmed) return;

//         try {
//             await axios.delete(`http://localhost:3006/announcements/${postId}`);
//             setAnnouncements((prev) => prev.filter((announcement) => announcement.post_id !== postId));
//             setSuccess('Announcement deleted successfully.');
//             setTimeout(() => setSuccess(null), 3000);
//         } catch (error) {
//             console.error('Error deleting announcement:', error);
//             setError('Failed to delete announcement. Please try again.');
//         }
//     };

//     // Handle post deletion
//     const handleDeletePost = async (postId) => {
//         const confirmed = window.confirm('Are you sure you want to delete this post?');
//         if (!confirmed) return;

//         try {
//             await axios.delete(`http://localhost:3005/posts/${postId}`);
//             setPosts((prev) => prev.filter((post) => post.id !== postId));
//             setSuccess('Post deleted successfully.');
//             setTimeout(() => setSuccess(null), 3000);
//         } catch (error) {
//             console.error('Error deleting post:', error);
//             setError('Failed to delete post. Please try again.');
//         }
//     };

//     return (
//         <div className="my-posts-container">
//             <UserSidebar />

//             <div className="mps-content">
//                 <div className="mps-tabs">
//                     <button
//                         className={activeTab === 'announcements' ? 'active' : ''}
//                         onClick={() => setActiveTab('announcements')}
//                     >
//                         Announcements
//                     </button>
//                     <button
//                         className={activeTab === 'posts' ? 'active' : ''}
//                         onClick={() => setActiveTab('posts')}
//                     >
//                         Posts
//                     </button>
//                 </div>

//                 <div className="mps-feed-container">
//                     <div className="mps-feed-content">
//                         {activeTab === 'announcements' && (
//                             <div className="mps-announcements">
//                                 <h2>My Announcements</h2>
//                                 {success && <p className="mps-success-message">{success}</p>}
//                                 {announcements.length > 0 ? (
//                                     announcements.map((announcement) => (
//                                         <div key={announcement.post_id} className="mps-announcement-item">
//                                             <div className="mps-announcement-header">
//                                                 <h3>{announcement.displayName}</h3>
//                                                 <small>{new Date(announcement.created_at).toLocaleString()}</small>
//                                             </div>
//                                             <p className="mps-announcement-text">{announcement.post_text}</p>
//                                             <button
//                                                 onClick={() => handleDeleteAnnouncement(announcement.post_id)}
//                                                 className="mps-delete-button"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>No announcements found.</p>
//                                 )}
//                                 {error && <p className="mps-error-message">{error}</p>}
//                             </div>
//                         )}

//                         {activeTab === 'posts' && (
//                             <div className="mps-feed">
//                                 <h2>My Posts</h2>
//                                 {success && <p className="mps-success-message">{success}</p>}
//                                 {posts.length > 0 ? (
//                                     posts.map((post) => (
//                                         <div key={post.id} className="mps-feed-post">
//                                             <h3>Post Name: {post.name}</h3>
//                                             <p>
//                                                 <strong>Post Description:</strong> {post.description}
//                                             </p>
//                                             <small>
//                                                 You posted this post on{' '}
//                                                 <strong>{new Date(post.created_at).toLocaleString()}</strong>
//                                             </small>
//                                             {post.type === 'image' ? (
//                                                 <img src={`http://localhost:3005${post.content_url}`} alt={post.title} />
//                                             ) : (
//                                                 <video controls>
//                                                     <source
//                                                         src={`http://localhost:3005${post.content_url}`}
//                                                         type="video/mp4"
//                                                     />
//                                                     Your browser does not support the video tag.
//                                                 </video>
//                                             )}
//                                             <button
//                                                 onClick={() => handleDeletePost(post.id)}
//                                                 className="mps-delete-button"
//                                             >
//                                                 Delete Post
//                                             </button>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>No posts found.</p>
//                                 )}
//                                 {error && <p className="mps-error-message">{error}</p>}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyPosts;

// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AccountContext } from '../SignIn-SignUp/Account';
// import './MyPosts.css';
// import UserSidebar from './UserSidebar';

// const MyPosts = () => {
//     const [announcements, setAnnouncements] = useState([]);
//     const [posts, setPosts] = useState([]);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [activeTab, setActiveTab] = useState('announcements');
//     const { getSession } = useContext(AccountContext);

//     // Fetch user ID on component mount
//     useEffect(() => {
//         fetchUserId();
//     }, []);

//     // Fetch announcements and posts when user ID is set
//     useEffect(() => {
//         if (userId) {
//             fetchMyAnnouncements();
//             fetchMyPosts();
//         }
//     }, [userId]);

//     // Fetch user ID from session
//     const fetchUserId = async () => {
//         try {
//             const session = await getSession();
//             const userEmail = session.idToken.payload.email;

//             const response = await axios.get('http://localhost:3002/getUserId', {
//                 params: { email: userEmail },
//             });

//             if (response.status === 200 && response.data.user_id) {
//                 setUserId(response.data.user_id);
//             } else {
//                 throw new Error('User ID not found');
//             }
//         } catch (error) {
//             console.error('Error fetching user ID:', error);
//             setError('Failed to fetch user ID. Please try again later.');
//         }
//     };

//     // Fetch announcements for the logged-in user
//     const fetchMyAnnouncements = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3006/announcements/user`, {
//                 params: { user_id: userId },
//             });
//             setAnnouncements(response.data);
//         } catch (error) {
//             console.error('Error fetching announcements:', error);
//             setError('Failed to fetch announcements. Please try again later.');
//         }
//     };

//     // Fetch posts for the logged-in user
//     const fetchMyPosts = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3005/posts/user`, {
//                 params: { user_id: userId },
//             });
//             setPosts(response.data);
//         } catch (error) {
//             console.error('Error fetching posts:', error);
//             setError('Failed to fetch posts. Please try again later.');
//         }
//     };

//     // Handle announcement deletion
//     const handleDeleteAnnouncement = async (postId) => {
//         const confirmed = window.confirm('Are you sure you want to delete this announcement?');
//         if (!confirmed) return;

//         try {
//             await axios.delete(`http://localhost:3006/announcements/${postId}`);
//             setAnnouncements((prev) => prev.filter((announcement) => announcement.post_id !== postId));
//             setSuccess('Announcement deleted successfully.');
//             setTimeout(() => setSuccess(null), 3000);
//         } catch (error) {
//             console.error('Error deleting announcement:', error);
//             setError('Failed to delete announcement. Please try again.');
//         }
//     };

//     // Handle post deletion
//     const handleDeletePost = async (postId) => {
//         const confirmed = window.confirm('Are you sure you want to delete this post?');
//         if (!confirmed) return;

//         try {
//             await axios.delete(`http://localhost:3005/posts/${postId}`);
//             setPosts((prev) => prev.filter((post) => post.id !== postId));
//             setSuccess('Post deleted successfully.');
//             setTimeout(() => setSuccess(null), 3000);
//         } catch (error) {
//             console.error('Error deleting post:', error);
//             setError('Failed to delete post. Please try again.');
//         }
//     };

//     return (
//         <div className="my-posts-container">
//             <UserSidebar />

//             <div className="mps-content">
//                 <div className="mps-tabs">
//                     <button
//                         className={activeTab === 'announcements' ? 'active' : ''}
//                         onClick={() => setActiveTab('announcements')}
//                     >
//                         Announcements
//                     </button>
//                     <button
//                         className={activeTab === 'posts' ? 'active' : ''}
//                         onClick={() => setActiveTab('posts')}
//                     >
//                         Posts
//                     </button>
//                 </div>

//                 <div className="mps-feed-container">
//                     <div className="mps-feed-content">
//                         {activeTab === 'announcements' && (
//                             <div className="mps-announcements">
//                                 <h2>My Announcements</h2>
//                                 {success && <p className="mps-success-message">{success}</p>}
//                                 {announcements.length > 0 ? (
//                                     announcements.map((announcement) => (
//                                         <div key={announcement.post_id} className="mps-announcement-item">
//                                             <div className="mps-announcement-header">
//                                                 <h3>{announcement.displayName}</h3>
//                                                 <small>{new Date(announcement.created_at).toLocaleString()}</small>
//                                             </div>
//                                             <p className="mps-announcement-text">{announcement.post_text}</p>
//                                             <button
//                                                 onClick={() => handleDeleteAnnouncement(announcement.post_id)}
//                                                 className="mps-delete-button"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>No announcements found.</p>
//                                 )}
//                                 {error && <p className="mps-error-message">{error}</p>}
//                             </div>
//                         )}

//                         {activeTab === 'posts' && (
//                             <div className="mps-feed">
//                                 <h2>My Posts</h2>
//                                 {success && <p className="mps-success-message">{success}</p>}
//                                 {posts.length > 0 ? (
//                                     posts.map((post) => (
//                                         <div key={post.id} className="mps-feed-post">
//                                             <h3>Post Name: {post.name}</h3>
//                                             <p>
//                                                 <strong>Post Description:</strong> {post.description}
//                                             </p>
//                                             <small>
//                                                 You posted this post on{' '}
//                                                 <strong>{new Date(post.created_at).toLocaleString()}</strong>
//                                             </small>
//                                             {post.type === 'image' ? (
//                                                 <img src={`http://localhost:3005${post.content_url}`} alt={post.title} />
//                                             ) : (
//                                                 <video controls>
//                                                     <source
//                                                         src={`http://localhost:3005${post.content_url}`}
//                                                         type="video/mp4"
//                                                     />
//                                                     Your browser does not support the video tag.
//                                                 </video>
//                                             )}
//                                             <button
//                                                 onClick={() => handleDeletePost(post.id)}
//                                                 className="mps-delete-button"
//                                             >
//                                                 Delete Post
//                                             </button>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>No Post found! <a href='/feedPage'>Upload your first post here!</a></p>
                                  
//                                 )}
//                                 {error && <p className="mps-error-message">{error}</p>}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyPosts;


import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AccountContext } from '../SignIn-SignUp/Account';
import './MyPosts.css';
import UserSidebar from './UserSidebar';

const MyPosts = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState('announcements');
    const { getSession } = useContext(AccountContext);

    // Fetch user ID on component mount
    useEffect(() => {
        fetchUserId();
    }, []);

    // Fetch announcements and posts when user ID is set
    useEffect(() => {
        if (userId) {
            fetchMyAnnouncements();
            fetchMyPosts();
        }
    }, [userId]);

    // Fetch user ID from session
    const fetchUserId = async () => {
        try {
            console.log('Fetching user session...');
            const session = await getSession();
            const userEmail = session.idToken.payload.email;

            console.log('Fetching user ID for email:', userEmail);
            const response = await axios.get('http://localhost:3002/getUserId', {
                params: { email: userEmail },
            });

            if (response.status === 200 && response.data.user_id) {
                setUserId(response.data.user_id);
                console.log('User ID fetched successfully:', response.data.user_id);
            } else {
                throw new Error('User ID not found');
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
            setError('Failed to fetch user ID. Please try again later.');
        }
    };

    // Fetch announcements for the logged-in user
    const fetchMyAnnouncements = async () => {
        try {
            console.log('Fetching announcements for user ID:', userId);
            const response = await axios.get('http://localhost:3006/announcements/user', {
                params: { user_id: userId },
            });
            console.log('Announcements fetched:', response.data);
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setError('Failed to fetch announcements. Please try again later.');
        }
    };

    // Fetch posts for the logged-in user
    const fetchMyPosts = async () => {
        try {
            console.log('Fetching posts for user ID:', userId);
            const response = await axios.get('http://localhost:3005/posts/user', {
                params: { user_id: userId },
            });
            console.log('Posts fetched:', response.data);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts. Please try again later.');
        }
    };

    // Handle announcement deletion
    const handleDeleteAnnouncement = async (postId) => {
        const confirmed = window.confirm('Are you sure you want to delete this announcement?');
        if (!confirmed) return;

        try {
            console.log('Deleting announcement with ID:', postId);
            await axios.delete(`http://localhost:3006/announcements/${postId}`);
            setAnnouncements((prev) => prev.filter((announcement) => announcement.post_id !== postId));
            setSuccess('Announcement deleted successfully.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error deleting announcement:', error);
            setError('Failed to delete announcement. Please try again.');
        }
    };

    // Handle post deletion
    const handleDeletePost = async (postId) => {
        const confirmed = window.confirm('Are you sure you want to delete this post?');
        if (!confirmed) return;

        try {
            console.log('Deleting post with ID:', postId);
            await axios.delete(`http://localhost:3005/posts/${postId}`);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
            setSuccess('Post deleted successfully.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post. Please try again.');
        }
    };

    return (
        <div className="my-posts-container">
            <UserSidebar />

            <div className="mps-content">
                <div className="mps-tabs">
                    <button
                        className={activeTab === 'announcements' ? 'active' : ''}
                        onClick={() => setActiveTab('announcements')}
                    >
                        Announcements
                    </button>
                    <button
                        className={activeTab === 'posts' ? 'active' : ''}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </button>
                </div>

                <div className="mps-feed-container">
                    <div className="mps-feed-content">
                        {activeTab === 'announcements' && (
                            <div className="mps-announcements">
                                <h2>My Announcements</h2>
                                {success && <p className="mps-success-message">{success}</p>}
                                {announcements.length > 0 ? (
                                    announcements.map((announcement) => (
                                        <div key={announcement.post_id} className="mps-announcement-item">
                                            <div className="mps-announcement-header">
                                                <h3>{announcement.displayName}</h3>
                                                <small>{new Date(announcement.created_at).toLocaleString()}</small>
                                            </div>
                                            <p className="mps-announcement-text">{announcement.post_text}</p>
                                            <button
                                                onClick={() => handleDeleteAnnouncement(announcement.post_id)}
                                                className="mps-delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No announcements found.</p>
                                )}
                                {error && <p className="mps-error-message">{error}</p>}
                            </div>
                        )}

                        {activeTab === 'posts' && (
                            <div className="mps-feed">
                                <h2>My Posts</h2>
                                {success && <p className="mps-success-message">{success}</p>}
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <div key={post.id} className="mps-feed-post">
                                            <h3>Post Name: {post.name}</h3>
                                            <p>
                                                <strong>Post Description:</strong> {post.description}
                                            </p>
                                            <small>
                                                You posted this post on{' '}
                                                <strong>{new Date(post.created_at).toLocaleString()}</strong>
                                            </small>
                                            {post.type === 'image' ? (
                                                <img src={`http://localhost:3005${post.content_url}`} alt={post.title} />
                                            ) : (
                                                <video controls>
                                                    <source
                                                        src={`http://localhost:3005${post.content_url}`}
                                                        type="video/mp4"
                                                    />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="mps-delete-button"
                                            >
                                                Delete Post
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No posts found.</p>
                                )}
                                {error && <p className="mps-error-message">{error}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPosts;

