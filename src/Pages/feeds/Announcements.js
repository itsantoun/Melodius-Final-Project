import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AccountContext } from '../SignIn-SignUp/Account';
import './Announcements.css';
import UserSidebar from '../User/UserSidebar';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [postText, setPostText] = useState('');
    const [copiedLink, setCopiedLink] = useState(null);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [displayName, setDisplayName] = useState(''); // New state for display name
    const [showScroll, setShowScroll] = useState(false);
    const [activeUserInfo, setActiveUserInfo] = useState({}); // New state to track active user info
    const { getSession } = useContext(AccountContext);

    useEffect(() => {
        fetchUserId();
        fetchAnnouncements();
        window.addEventListener('scroll', checkScrollTop);
        return () => {
            window.removeEventListener('scroll', checkScrollTop);
        };
    }, []);

    const fetchUserId = async () => {
        try {
            const session = await getSession();
            const userEmail = session.idToken.payload.email;

            const response = await axios.get('http://localhost:3002/getUserId', {
                params: { email: userEmail }
            });
            setUserId(response.data.user_id);
            setDisplayName(session.idToken.payload['cognito:username']); // Assuming 'cognito:username' is the display name
        } catch (error) {
            console.error('Error fetching user ID:', error);
            setError('Failed to fetch user ID. Please try again later.');
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:3006/announcements');
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setError('Failed to fetch announcements. Please try again later.');
        }
    };

    const fetchUserInfo = async (displayName) => {
        try {
            const response = await axios.get('http://localhost:3006/getUserInfo', {
                params: { displayName }
            });
            setActiveUserInfo((prevState) => ({
                ...prevState,
                [displayName]: prevState[displayName] ? null : response.data
            }));
        } catch (error) {
            console.error('Error fetching user info:', error);
            setError('Failed to fetch user info. Please try again later.');
        }
    };

    const handlePostTextChange = (e) => {
        setPostText(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError('User ID not available. Please try again.');
            return;
        }
        try {
            const created_at = new Date();
            await axios.post('http://localhost:3006/announcements', 
                { user_id: userId, post_text: postText, created_at }
            );
            setPostText('');
            fetchAnnouncements(); // Fetch latest announcements after posting a new one
        } catch (error) {
            console.error('Error creating announcement:', error);
            setError('Failed to create announcement. Please try again.');
        }
    };

    // const handleCopyLink = (postId) => {
    //     const postUrl = `${window.location.origin}/AnnouncementsPage/${postId}`;
    //     navigator.clipboard.writeText(postUrl)
    //         .then(() => setCopiedLink(postId))
    //         .catch((error) => console.error('Error copying link:', error));
    // };

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 300) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 300) {
            setShowScroll(false);
        }
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <UserSidebar />
            <div className="announcements-page">
                <div className="post-announcement">
                    <h2>Create Announcement</h2>
                    <form onSubmit={handleFormSubmit} className="announcement-form">
                        <textarea
                            value={postText}
                            onChange={handlePostTextChange}
                            placeholder="Write your announcement here..."
                            rows="4"
                            required
                        />
                        <button type="submit">Post Announcement</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="announcement-feed">
                    <h2>Announcements</h2>
                    {announcements.map((announcement) => (
                        <div key={announcement.post_id} className="announcement-item">
                            <div className="announcement-header">
                                <h3>Name: {announcement.displayName}</h3>
                                <small><strong>Posted on:</strong> {new Date(announcement.created_at).toLocaleString()}</small>
                            </div>
                            <p className="announcement-text">Description: {announcement.post_text}</p>
                            {/* <button onClick={() => handleCopyLink(announcement.post_id)} className="copy-link-button">
                                {copiedLink === announcement.post_id ? 'Link Copied!' : 'Copy Link'}
                            </button> */}
                            <button onClick={() => fetchUserInfo(announcement.displayName)} className="fetch-user-info-button">
                                {activeUserInfo[announcement.displayName] ? 'Hide Info' : 'Contact us'}
                            </button>
                            {activeUserInfo[announcement.displayName] && (
                                <table className="user-info-table">
                                    <tbody>
                                        <tr>
                                            <td>Email</td>
                                            <td>{activeUserInfo[announcement.displayName].email}</td>
                                        </tr>
                                        <tr>
                                            <td>First Name</td>
                                            <td>{activeUserInfo[announcement.displayName].firstName}</td>
                                        </tr>
                                        <tr>
                                            <td>Last Name</td>
                                            <td>{activeUserInfo[announcement.displayName].lastName}</td>
                                        </tr>
                                        <tr>
                                            <td>Address</td>
                                            <td>{activeUserInfo[announcement.displayName].address}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>
                {showScroll && (
                    <div className="scroll-top" onClick={scrollTop}>
                        <span className="tooltiptext">Add an Announcement</span>
                        +
                    </div>
                )}
            </div>
        </>
    );
};

export default Announcements;
