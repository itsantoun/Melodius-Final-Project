import React, { useState } from 'react'
import { db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/login.css'
import band from '../Assets/hero-bg.png'



function Login() {

  // const [login,setLogin] = useState(false);
  // const [error, setError] = useState(null);


  const [setLogin] = useState(false);



  
  const history = useNavigate()


  const handleSubmit = (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
  
    
      // Assuming you want to handle login here
      signInWithEmailAndPassword(db, email, password) 
      .then((data) => {
        console.log(data, "authData");
        history('/userDashboard');
        })
        .catch((err) => {
          alert(err.code);
          setLogin(true);
        });

  };

  // const handleAuthError = (err) => {
  //   // Handle different error codes and set error state accordingly
  //   let errorMessage = '';
  //   switch (err.code) {
  //     case 'auth/email-already-in-use':
  //       errorMessage = (
  //         <span>
  //           The email address is already in use.{' '}
  //           <Link to='/login'>Sign In instead?</Link>
  //         </span>
  //       );
        
  //       break;
  //     case 'auth/invalid-email':
  //       errorMessage = 'The email address is not valid.';
  //       break;
  //     case 'auth/operation-not-allowed':
  //       errorMessage = 'Operation not allowed.';
  //       break;
  //     case 'auth/weak-password':
  //       errorMessage = 'The password is too weak.';
  //       break;
  //     default:
  //       errorMessage = 'An error occurred.';
  //   }

  //   setError({ message: errorMessage, field: err.code === 'auth/invalid-email' ? 'email' : 'password' });
  // };


  return (
    <div className='body'>
   
   
    <div>
    {/* Login */}
    <form onSubmit={(e) => handleSubmit(e, 'login')}>
    <img src={band} alt='band' className='img'/>
    <div className='info'>
    <h1> Login</h1>
    <input className='input-box' name='email' placeholder='Email'/>
    <input className='input-box' name='password' type='password' placeholder='Password'/>
    <p> Forgot your password?    <Link > Click Here</Link></p>
    <p>Don't have an account yet? <Link to='/Register'> Create one!</Link></p>
    <button>SignIn</button>
    <h1> or sign in using:</h1>
    </div>
    </form>
    </div>
    </div>
  )
}

export default Login
