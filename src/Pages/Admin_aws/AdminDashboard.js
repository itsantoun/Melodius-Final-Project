import React, { useState, useContext, useEffect } from 'react';
import '../../CSS/Dashboard.css';
import UserSidebar from './AdminSidebar';
import { AccountContext } from '../SignIn-SignUp/Account'; 

function AdminDashboard() {
  // State to store user role
  const [userRole, setUserRole] = useState(null);
  
  // Access the AccountContext
  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    // Function to fetch session and extract user role
    const fetchUserRole = async () => {
      try {
        const session = await getSession();
        // Assuming user role is stored in session data under 'userRole'
        const role = session.idToken.payload['cognito:groups'][0]; // Adjust this according to your Cognito configuration
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole(); // Call the function on component mount
  }, [getSession]);

  return (
    <>
      <UserSidebar />
      <h1>Hello {userRole ? `${userRole}` : 'Admin'}</h1>
    </>
  );
}

export default AdminDashboard;
