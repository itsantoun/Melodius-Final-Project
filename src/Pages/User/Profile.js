import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from '../SignIn-SignUp/Account';
import UserPool from '../SignIn-SignUp/UserPool';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserSidebar from './UserSidebar';
import './profile.css';

function Profile() {
    const [status, setStatus] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState(null); // State for success/error message
    const { getSession, updateProfile } = useContext(AccountContext);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const session = await getSession();
                console.log("Session: ", session);
                setStatus(true);
                setUserInfo(session.idToken.payload);
            } catch (error) {
                console.error("Error fetching session: ", error);
                setStatus(false);
            }
        };

        fetchSession();

        // Cleanup function to avoid memory leaks
        return () => {
            // Any cleanup code if needed
        };
    }, [getSession]); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const session = await getSession();
            console.log('Session:', session);
    
            if (!session) {
                console.error('User is not authenticated');
                setMessage({ type: 'error', content: 'Please login to update your profile.' });
                return;
            }
    
            await updateProfile(formData);
            // If update is successful, you may want to fetch updated user info
            const updatedSession = await getSession();
            setUserInfo(updatedSession.idToken.payload);
            setFormData({});
            setEditing(false);
            setMessage({ type: 'success', content: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', content: 'Error updating profile. Please try again later.' });
        }
    };
    
    

    return (
        <div>
            <UserSidebar />
            <div className="profile-container">
                {status ? (
                    <div>
                        <h2>Personal Information:</h2>
                        {message && (
                            <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
                                {message.content}
                            </div>
                        )}
                        <table>
                            <tbody>
                                <tr>
                                    <td>First Name:</td>
                                    <td>{editing ? <input type="text" name="given_name" value={formData.given_name || userInfo.given_name} onChange={handleInputChange} /> : userInfo.given_name}</td>
                                </tr>
                                <tr>
                                    <td>Username:</td>
                                    <td>{editing ? <input type="text" name="name" value={formData.name || userInfo.name} onChange={handleInputChange} /> : userInfo.name}</td>
                                </tr>
                                <tr>
                                    <td>Family Name:</td>
                                    <td>{editing ? <input type="text" name="family_name" value={formData.family_name || userInfo.family_name} onChange={handleInputChange} /> : userInfo.family_name}</td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>{userInfo.email}</td>
                                </tr>
                                <tr>
                                    <td>Address:</td>
                                    <td>{userInfo.address ? userInfo.address.formatted : 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <td>Birthdate:</td>
                                    <td>{userInfo.birthdate}</td>
                                </tr>
                                <tr>
                                    <td>User Type:</td>
                                    <td>{userInfo['custom:userType']}</td>
                                </tr>
                            </tbody>
                        </table>
                        {editing ? (
                            <div>
                                <button onClick={handleSubmit}>Save</button>
                                <button onClick={() => setEditing(false)}>Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing(true)}>Edit Profile</button>
                        )}
                    </div>
                ) : (
                    "Please Login"
                )}
            </div>
        </div>
    );
}

export default Profile;
