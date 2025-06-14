// import React, { useState, useContext, useEffect } from 'react';
// import '../../CSS/Dashboard.css';
// import UserSidebar from './AdminSidebar';
// import { AccountContext } from '../SignIn-SignUp/Account'; 

// function AdminDashboard() {
//   // State to store user role
//   const [userRole, setUserRole] = useState(null);
  
//   // Access the AccountContext
//   const { getSession } = useContext(AccountContext);

//   useEffect(() => {
//     // Function to fetch session and extract user role
//     const fetchUserRole = async () => {
//       try {
//         const session = await getSession();
//         // Assuming user role is stored in session data under 'userRole'
//         const role = session.idToken.payload['cognito:groups'][0]; // Adjust this according to your Cognito configuration
//         setUserRole(role);
//       } catch (error) {
//         console.error('Error fetching user role:', error);
//       }
//     };

//     fetchUserRole(); // Call the function on component mount
//   }, [getSession]);

//   return (
//     <>
//       <UserSidebar />
//       <h1>Hello {userRole ? `${userRole}` : 'Admin'}</h1>
//     </>
//   );
// }

// export default AdminDashboard;


import React, { useState, useContext, useEffect } from 'react';
import '../../CSS/Dashboard.css';
import UserSidebar from './AdminSidebar';
import { AccountContext } from '../SignIn-SignUp/Account'; 

function AdminDashboard() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0); // New state for user count

  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const session = await getSession();
        const role = session.idToken.payload['cognito:groups'][0];
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [getSession]);

  // Simulate fetching user count (replace with real API call)
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        // Replace this with actual API call to fetch user count
        const count = await new Promise((resolve) => setTimeout(() => resolve(150), 1000)); 
        setUserCount(count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <UserSidebar />
      <div className="dashboard-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h1>Welcome {userRole ? `${userRole}` : 'Admin'}</h1>
          <p>Today's Date: {currentDate}</p>
          <p>Current Time: {currentTime}</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="card">
            <h3>Total Users</h3>
            <p>{userCount}</p> {/* Displaying dynamic user count */}
          </div>
          <div className="card">
            <h3>Active Users</h3>
            <p>80</p> {/* Placeholder, replace with real data */}
          </div>
        </div>

        {/* New Section - System Metrics or Notifications */}
        <div className="system-metrics">
          <h2>System Metrics</h2>
          <ul>
            <li>Server Uptime: 99.9%</li>
            <li>Database Response Time: 120ms</li>
            <li>API Requests: 1500 today</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
