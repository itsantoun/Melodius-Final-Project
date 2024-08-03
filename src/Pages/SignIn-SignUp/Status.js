import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './Account';
    
function Status() {
    const [status, setStatus] = useState(false);
    const [name, setName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [quote, setQuote] = useState('');
    const { getSession, logout } = useContext(AccountContext);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const session = await getSession();
                console.log("Session: ", session);
                setStatus(true);
                const { idToken: { payload: { name, ['user_Role']: userRole } } } = session;
                setName(name);
                setUserRole(userRole);
            } catch (error) {
                console.error("Error fetching session: ", error);
                setStatus(false);
            }
        };

        const fetchQuote = async () => {
            try {
                // Fetch quote from an API or use a predefined list
                const response = await fetch('https://api.example.com/quote-of-the-day');
                const data = await response.json();
                setQuote(data.quote);
            } catch (error) {
                console.error("Error fetching quote: ", error);
                // Handle quote fetch error
            }
        };

        fetchSession();
        fetchQuote();

        // Cleanup function to avoid memory leaks
        return () => {
            // Any cleanup code if needed
        };
    }, [getSession]); // Added getSession to the dependency array

    const handleLogout = async () => {
        try {
            await logout();
            setStatus(false);
            console.log("Logged out successfully");
            window.location.href = '/';
            
        } catch (error) {
            console.error("Failed to logout:", error);
            // Handle logout failure
        }
    };

    return (
        <div>
            {status ? (
                <div>
                    <p>Welcome, {name}</p>
                    {/* <p>Quote of the Day: {quote}</p> */}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                "Please Login"
            )}
        </div>
    );
}

export default Status;
