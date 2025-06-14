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
        await getSession();
      } catch (error) {
        navigate('/signin');
      }
    };

    checkSession();
  }, [getSession, navigate]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Account>
      <>
        <UserSidebar />
        <div className="dashboard-content">
          <h1>Dashboard</h1>
          <div className="button-container">
            <button onClick={() => handleNavigate('/my_posts')} className="dashboard-button">
              My Posts
            </button>
            <button onClick={() => handleNavigate('/announcements')} className="dashboard-button">
              Announcements
            </button>
            <button onClick={() => handleNavigate('/library')} className="dashboard-button">
              Library
            </button>
          </div>
        </div>
      </>
    </Account>
  );
}

export default Dashboard;
