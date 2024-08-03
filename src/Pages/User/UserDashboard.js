import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Dashboard.css';
import UserSidebar from './UserSidebar';
import { Account, AccountContext } from '../SignIn-SignUp/Account';

function Dashboard() {
  const navigate = useNavigate();
  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if user is already authenticated
        await getSession();
      } catch (error) {
        // If not authenticated, redirect to signin page
        navigate('/signin');
      }
    };

    checkSession();
  }, [getSession, navigate]);

  return (
    <Account>
      <>
        <UserSidebar />
       
      </>
    </Account>
  );
}

export default Dashboard;
