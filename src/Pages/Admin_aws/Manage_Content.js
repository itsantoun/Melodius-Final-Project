import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../User/MyPosts.css'; // Assuming this CSS file contains the required styles
import './Manage_Content.css';
import AdminSidebar from './AdminSidebar'; // Sidebar component for admin users

const Manage_Content = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('announcements');

    // Fetch all announcements and posts on component mount
    useEffect(() => {
        fetchAllAnnouncements();
        fetchAllPosts();
    }, []);

    // Fetch all announcements
    const fetchAllAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:3006/announcements/all');
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setError('Failed to fetch announcements. Please try again later.');
        }
    };

    // Fetch all posts
    const fetchAllPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3005/posts/all');
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
            await axios.delete(`http://localhost:3005/posts/${postId}`);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
            setSuccess('Post deleted successfully.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post. Please try again.');
        }
    };

    const handleDeletePostWithNotification = async (postId) => {
        const confirmed = window.confirm('Are you sure you want to delete this post and notify the user?');
        if (!confirmed) return;
    
        try {
            await axios.delete(`http://localhost:3005/posts/${postId}`, {
                headers: {
                    'admin-email': 'antoun.atallah@icloud.com' // Include admin email in the request
                }
            });
            setPosts((prev) => prev.filter((post) => post.id !== postId));
            setSuccess('Post deleted successfully and email notification sent.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error deleting post with notification:', error);
            setError('Failed to delete post with notification. Please try again.');
        }
    };

    return (
        <div className="manage-content-container">
            <AdminSidebar />

            <div className="mc-content">
                <div className="mc-tabs">
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

                <div className="mc-feed-container">
                    <div className="mc-feed-content">
                        {activeTab === 'announcements' && (
                            <div className="mc-announcements">
                                {/* <h2>All Announcements</h2> */}
                                {success && <p className="mc-success-message">{success}</p>}
                                {announcements.length > 0 ? (
                                    announcements.map((announcement) => (
                                        <div key={announcement.post_id} className="mc-announcement-item">
                                            <div className="mc-announcement-header">
                                                <h3>{announcement.displayName}</h3>
                                                <small>{new Date(announcement.created_at).toLocaleString()}</small>
                                            </div>
                                            <p className="mc-announcement-text">{announcement.post_text}</p>
                                            <button
                                                onClick={() => handleDeleteAnnouncement(announcement.post_id)}
                                                className="mc-delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No announcements found.</p>
                                )}
                                {error && <p className="mc-error-message">{error}</p>}
                            </div>
                        )}

                        {activeTab === 'posts' && (
                            <div className="mc-feed">
                                {/* <h2>All Posts</h2> */}
                                {success && <p className="mc-success-message">{success}</p>}
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <div key={post.id} className="mc-feed-post">
                                            <h3>Post Name: {post.name}</h3>
                                            <p>
                                                <strong>Post Description:</strong> {post.description}
                                            </p>
                                            <small>
                                                Posted by {post.user_displayname} on{' '}
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
                                                className="mc-delete-button"
                                            >
                                                Delete Post
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No posts found.</p>
                                )}
                                {error && <p className="mc-error-message">{error}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Manage_Content;