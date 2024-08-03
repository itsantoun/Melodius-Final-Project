import React, { useContext } from 'react';
import '../CSS/NavBar.css';
import { Link } from 'react-router-dom';
import { AccountContext } from '../Pages/SignIn-SignUp/Account';
import logoMelodious from '../Assets/logoMelodious.jpg';

function NavBar() {
  const accountContext = useContext(AccountContext);

  const isLoggedIn = async () => {
    console.log('Checking login status');
    try {
      await accountContext.getSession();
      return true;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  };

  return (
    <nav>
      <div className="left-side">
      <Link to='/'><img  className='logo-melodious' src={logoMelodious} alt='logo' /></Link>
      </div>
      <div className="right-side">
        <Link to='/about'>About</Link>
        <Link to='/library'>Library</Link>
        {isLoggedIn() ? (
          <Link to='/UserDashboard' className="login-button">
            My Account
          </Link>
        ) : (
          <Link to='/signup' className="login-button">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;