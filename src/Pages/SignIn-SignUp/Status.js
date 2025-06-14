import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './Account';
import '../User/UserDashboard.css'; // Assuming this contains the sidebar styles

function Status() {
    const [status, setStatus] = useState(false);
    const [name, setName] = useState('');
    const [userRole, setUserRole] = useState('');
    const { getSession, logout } = useContext(AccountContext);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const session = await getSession();
                setStatus(true);
                const { idToken: { payload: { name, ['user_Role']: userRole } } } = session;
                setName(name);
                setUserRole(userRole);
            } catch (error) {
                setStatus(false);
            }
        };

        fetchSession();
    }, [getSession]);

    const handleLogout = async () => {
        try {
            await logout();
            setStatus(false);
            window.location.href = '/';
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    return (
        <div className="status-container">
            {status ? (
                <div className="status-info">
                    <p>Welcome, <strong>{name}</strong></p>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p className="login-prompt">Please Login</p>
            )}
        </div>
    );
}

export default Status;
