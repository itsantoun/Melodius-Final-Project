import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSS/login.css';
import { AccountContext } from './Account';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import signinIMG from '../../Assets/signin.jpg';

function Signin() {
    const { getSession, authenticate } = useContext(AccountContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                await getSession();
                navigate('/Profile');
            } catch (error) {
                console.error('User not signed in:', error);
            }
        };
        checkSession();
    }, [getSession, navigate]);

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); 

        try {
            await authenticate(email, password);
            console.log("Logged in successfully");
            if (email === 'antoun.atallah@icloud.com') {
                navigate('/AdminDashboard');
            } else {
                navigate('/profile');
            }
        } catch (error) {
            console.error("Failed to login:", error);
            setMessage("Failed to login: " + error.message);
        } finally {
            setIsLoading(false); // Set loading state to false after authentication completes
        }
    };

    return (
        <div className='body'>
            <div>
                <form onSubmit={onSubmit}>
                    <div class='info'>
                        <div class='welcome'>
                            <img src={signinIMG} className='img-login' alt='signup'/>
                        </div>
                        <div class='signin'>
                            <Link to='/' className='back-btn' ><IoArrowBackCircleOutline /></Link>
                            <h1>Login</h1>
                            <input
                                class='input-box'
                                name='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                class='input-box'
                                name='password'
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                           
                            <p>Don't have an account yet? <a href='/signup'>Create one!</a></p>
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                            {message && <h2>{message}</h2>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signin;
