import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/signup.css';
// import { RiUserFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import UserPool from './UserPool';
import signupIMG from '../../Assets/signup.jpg';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

function Signup() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    // const [avatar, setAvatar] = useState('');
    const [userType, setUserType] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [verificationStep, setVerificationStep] = useState(false); // State variable to control verification step   

    // const onSubmit = (event) => {
    //     event.preventDefault();

    //     if (verificationStep) {
    //         verifyUser();
    //     } else {
    //         // Proceed with signup
    //         // Create a list of user attributes
    //         const userAttributes = [
    //             new CognitoUserAttribute({ Name: 'given_name', Value: firstName }),
    //             new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
    //             new CognitoUserAttribute({ Name: 'name', Value: displayName }),
    //             new CognitoUserAttribute({ Name: 'birthdate', Value: dateOfBirth }),
    //             new CognitoUserAttribute({ Name: 'address', Value: address }),
    //             new CognitoUserAttribute({ Name: 'custom:userType', Value: userType })
    //         ];

    //         UserPool.signUp(email, password, userAttributes, null, (err, data) => {
    //             if (err) {
    //                 console.error('Error signing up:', err);
    //                 let errorMessage = 'Something went wrong';
    //                 if (err.code === 'UsernameExistsException') {
    //                     errorMessage = (
    //                         <>
    //                             An account with this email already exists.
    //                             <br />
    //                             <span>
    //                                 <Link to="/signin">Log in</Link>
    //                             </span>
    //                             &nbsp;instead ?
    //                         </>
    //                     );
    //                 } else if (err.code === 'InvalidPasswordException') {
    //                     errorMessage = 'Password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and special characters.';
    //                 } else {
    //                     errorMessage = `Error: ${err.message}`;
    //                 }
    //                 setMessage(errorMessage);
    //             } else {
    //                 console.log('Signup successful:', data);
    //                 setMessage('Success: Please check your email for the verification code.');
    //                 setVerificationStep(true); // Move to verification step
    //             }
    //         });
    //     }
    // };

    const onSubmit = (event) => {
        event.preventDefault();
    
        if (verificationStep) {
            verifyUser();
        } else {
            // Create a list of user attributes
            const userAttributes = [
                new CognitoUserAttribute({ Name: 'given_name', Value: firstName }),
                new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
                new CognitoUserAttribute({ Name: 'name', Value: displayName }),
                new CognitoUserAttribute({ Name: 'birthdate', Value: dateOfBirth }),
                new CognitoUserAttribute({ Name: 'address', Value: address }),
                new CognitoUserAttribute({ Name: 'custom:userType', Value: userType })
            ];
    
            UserPool.signUp(email, password, userAttributes, null, (err, data) => {
                if (err) {
                    console.error('Error signing up:', err);
                    let errorMessage = 'Something went wrong';
                    if (err.code === 'UsernameExistsException') {
                        errorMessage = (
                            <>
                                An account with this email already exists.
                                <br />
                                <span>
                                    <Link to="/signin">Log in</Link>
                                </span>
                                &nbsp;instead ?
                            </>
                        );
                    } else if (err.code === 'InvalidPasswordException') {
                        errorMessage = 'Password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and special characters.';
                    } else {
                        errorMessage = `Error: ${err.message}`;
                    }
                    setMessage(errorMessage);
                } else {
                    console.log('Signup successful:', data);
                    setMessage('Success: Please check your email for the verification code.');
                    setVerificationStep(true); // Move to verification step
    
                    // Save user data to MySQL database
                    const userData = {
                        firstName,
                        lastName,
                        displayName,
                        email,
                        password,
                        dateOfBirth,
                        address,
                        userType
                    };
    
                    fetch('http://localhost:3002/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message !== 'User registered successfully') {
                            console.error('Error saving user data to MySQL:', data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
            });
        }
    };
    

    const verifyUser = () => {
        const user = new CognitoUser({ Username: email, Pool: UserPool });
        user.confirmRegistration(verificationCode, true, (err, result) => {
            if (err) {
                console.error('Error confirming sign up:', err);
                setMessage(`Error confirming sign up: ${err.message}`);
            } else {
                console.log('Confirmation successful:', result);
                setMessage('Success: Account confirmed successfully');
                navigate('/UserDashboard'); // Redirect after successful verification
            }
        });
    };

    return (
        <div className="body">
            <div className="box">
                <form onSubmit={onSubmit}>
                    <Link to='/signin' className='back-btn' ><IoArrowBackCircleOutline /></Link>
                    <span className="logo">Create an Account</span>

                    {!verificationStep && (
                        <>
                            <div className="inputs-container">
                                <input required className='inputs' type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <input required className='inputs' type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>

                            <div className="inputs-container">
                                <input required className='inputs' type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                <input required className='inputs' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="inputs-container">
                                <input required className='inputs' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <input required className='inputs' type="date" placeholder="Date of Birth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                            </div>

                            <div className="inputs-container">
                                <input required className='inputs' type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>

                            <div>
                                <label>
                                    <input 
                                        type="radio" 
                                        value="musician" 
                                        checked={userType === 'musician'} 
                                        onChange={() => setUserType('musician')} 
                                    />
                                    Musician
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        value="singer" 
                                        checked={userType === 'singer'} 
                                        onChange={() => setUserType('singer')} 
                                    />
                                    Singer
                                </label>
                            </div>
                        </>
                    )}

                    {message && <span className="message">{message}</span>}

                    <div className="button-container">
                        <button type="submit">{verificationStep ? 'Verify' : 'Sign up'}</button>
                    </div>

                    {verificationStep && (
                        <div className="verification-container">
                            <input required className='inputs' type="text" placeholder="Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                        </div>
                    )}
                </form>

                <img src={signupIMG} className='img' alt='signup'/>
                {/* <p>
                    Already have an account? <Link to="/signin">Login</Link>
                </p> */}
            </div>
        </div>
    );
}

export default Signup;
