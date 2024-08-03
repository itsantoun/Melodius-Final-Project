import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AccountContext } from '../SignIn-SignUp/Account'; // Assuming AccountContext is available for session management
import './feedPage.css'; // Import the CSS file
import UserSidebar from '../User/UserSidebar';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newComments, setNewComments] = useState({}); // State to manage new comments for each post
    const [selectedUser, setSelectedUser] = useState(null); // State to manage selected user info
    const [popupPosition, setPopupPosition] = useState({}); // State to manage popup position
    const { getSession } = useContext(AccountContext);
    const formRef = useRef(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsFormVisible(false);
            }
        };

        if (isFormVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFormVisible]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3005/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts. Please try again later.');
        }
    };

    const fetchUserInfoByDisplayName = async (displayName) => {
        try {
            const response = await axios.get('http://localhost:3002/getUserInfo', {
                params: { displayName }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user information:', error);
            setError('Failed to fetch user information. Please try again later.');
            return null;
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const session = await getSession();
            const userEmail = session.idToken.payload.email;

            const userResponse = await axios.get('http://localhost:3002/getUserId', {
                params: { email: userEmail }
            });
            const user_id = userResponse.data.user_id;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', user_id);
            formData.append('title', title);
            formData.append('description', description);

            await axios.post('http://localhost:3005/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Fetch posts again to refresh the list
            fetchPosts();

            setTitle('');
            setDescription('');
            setFile(null);
            setIsFormVisible(false); // Hide form after successful upload
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        }
    };

    const handleCommentChange = (postId, comment) => {
        setNewComments({
            ...newComments,
            [postId]: comment
        });
    };

    const handleCommentSubmit = async (postId) => {
        try {
            const comment = newComments[postId];
            if (!comment) return;

            const session = await getSession();
            const userEmail = session.idToken.payload.email;

            const userResponse = await axios.get('http://localhost:3002/getUserId', {
                params: { email: userEmail }
            });
            const user_id = userResponse.data.user_id;
            const user_displayname = session.idToken.payload.name;

            await axios.post(`http://localhost:3005/posts/${postId}/comment`, {
                user_id,
                comment
            });

            // Update the comments for the specific post locally
            setPosts(posts.map(post => {
                const updatedComments = post.id === postId 
                    ? [...(tryParseJSON(post.comments) || []), { user_displayname, comment, created_at: new Date() }]
                    : post.comments;
                return { ...post, comments: JSON.stringify(updatedComments) };
            }));

            // Clear the new comment input for the post
            setNewComments({
                ...newComments,
                [postId]: ''
            });
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const tryParseJSON = (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    };

    const handleDisplayNameClick = async (displayName, event) => {
        const userInfo = await fetchUserInfoByDisplayName(displayName);
        setSelectedUser(userInfo);
        setPopupPosition({
            top: event.target.getBoundingClientRect().top + window.scrollY,
            left: event.target.getBoundingClientRect().right + 10 + window.scrollX
        });
    };

    const handleCloseUserInfo = () => {
        setSelectedUser(null);
    };

    return (
        <>
            <UserSidebar />
            <div className="feed-page">
                <button className="toggle-form-button" onClick={() => setIsFormVisible(!isFormVisible)}>
                    {isFormVisible ? 'Close Form' : 'Upload Post'}
                </button>
                {isFormVisible && (
                    <div className="upload-post" ref={formRef}>
                        <h2>Upload Post</h2>
                        <form onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                required
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                rows="4"
                                cols="50"
                                required
                            />
                            <input type="file" onChange={handleFileChange} required />
                            <button type="submit">Upload</button>
                        </form>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                )}
                <div className="feed-posts">
                    <h2>Feed</h2>
                    {posts.map((post) => (
                        <div key={post.id} className="feed-post">
                            <h3>{post.title}</h3>
                           
                            <small>
                                Posted by  
                                <span 
                                    className="user-displayname" 
                                    onClick={(e) => handleDisplayNameClick(post.user_displayname, e)}
                                >
                                    {post.user_displayname}  <p>{post.description}</p>
                                </span> 
                                on {new Date(post.created_at).toLocaleString()}
                            </small>
                            {post.type === 'image' ? (
                                <img src={`http://localhost:3005${post.content_url}`} alt={post.title} />
                            ) : (
                                <video controls>
                                    <source src={`http://localhost:3005${post.content_url}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            <div className="comments">
                                {tryParseJSON(post.comments).map((comment, index) => (
                                    <div key={index} className="comment">
                                        <small><strong>{comment.user_displayname}: </strong> {comment.comment}</small>
                                    </div>
                                ))}
                            </div>
                            <div className="comment-section">
                                <input
                                    type="text"
                                    value={newComments[post.id] || ''}
                                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                    placeholder="Add a comment..."
                                />
                                <button onClick={() => handleCommentSubmit(post.id)}>Post Comment</button>
                            </div>
                        </div>
                    ))}
                </div>
                {selectedUser && (
                    <div className="user-info-tooltip" style={{ top: popupPosition.top, left: popupPosition.left }}>
                        <div className="user-info-content">
                            <h2>Know more about {selectedUser.firstName}</h2>
                            <p><strong>First Name: </strong> {selectedUser.firstName}</p>
                            <p><strong>Last Name: </strong> {selectedUser.lastName}</p>
                            <p><strong>Email: </strong> {selectedUser.email}</p>
                            <p><strong>Lives in: </strong> {selectedUser.address}</p>
                            <p><strong>Status: </strong>{selectedUser.firstName} is a {selectedUser.userType}</p>
                            <button onClick={handleCloseUserInfo}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FeedPage;
