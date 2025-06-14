import React from 'react';
import NavBar from './NavBar';
import '../CSS/home.css';
import Image from '../Assets/hero-bg.png';
import library from '../Assets/library.jpg'
import { TbCircleNumber1 } from "react-icons/tb";
import { TbCircleNumber2 } from "react-icons/tb";
import { TbConfetti } from "react-icons/tb";

import { Link } from 'react-router-dom';


function Home() {
  return (
    <>
     
      <div>
      {/* <NavBar /> */}
      <div className="landing-page">
        <div className="landing-content">
          <div className="text">
            <h1>Welcome to Melodious</h1>
            <p>A Place Dedicated for Artists</p>
            {/* <button className="cta-button">Get Started</button> */}
            <Link to='/signup' className="cta-button">Get Started</Link>
          </div>
          <div className="image-container">
            <img src={Image} alt="Your Image" />
          </div>
          </div> 
        </div>

        <div class="landing-page-services">
  <h2 class="h2-what-for">What is this website for?</h2>

  <div class="service-box-container">
    <div class="service-box">
      <div class="box-text">Search and Explore any type of music sheet you want to play or sing</div>
    </div>
    <div class="service-box">
      <div class="box-text">Post and Connect with other musicians that fits you!</div>
    </div>
    {/* <div class="service-box">
      <div class="box-text">Text for service 3</div>
    </div>
    <div class="service-box">
      <div class="box-text">Text for service 4</div>
    </div> */}
  </div>
</div>




<div class="landing-page-steps">
<h2 class="h2-what-for">How to join ???</h2>
  <div class="steps">
    <ol>
      <li><span class="step-number"><TbCircleNumber1 /></span> Create an Account</li>
      <p>To get started, click on the "GET STARTED" button, to begin the registration process.</p>

      <li><span class="step-number"><TbCircleNumber2 /></span> Confirm Your Account</li>
      <p>After filling out the required information, such as your email address and password, you'll receive a confirmation email. Check your inbox and click on the confirmation link provided to verify your account.</p>

      <li><span class="step-number"><TbConfetti /></span> You are All Set!</li>
      <p>Once your account is confirmed, you're all set to enjoy our services! Log in with your credentials and explore the features and benefits available to you.</p>
    </ol>
  </div>
  <div class="get-started-button">
    <a href="/signup" class="get-started">Get Started</a>
  </div>
</div>



      {/* <div className="landing-page-services">
      <h1>How to join?</h1>
      </div> */}

      
      <footer>
  <div class="footer-content">
    <div class="footer-section contact">
      <h3>Contact Us</h3>
      <p>Lebanese American Univeristy, Beirut, Lebanon</p>
      <p>Phone: +961-79-302194</p>
      <p> <a href='mailto:antoun.atallah@lau.edu'>Email: antoun.atallah@lau.edu</a></p>
    </div>

    <div class="footer-section links">
      <h3>Quick Links</h3>
      <ul>
        <li> <Link to='/'>Home</Link></li>
        <li><Link to='/library'>Library</Link></li>
        {/* <li><a href="#">Contact Us</a></li> */}
      </ul>
    </div>

    <div class="footer-section social">
      <h3>Connect with Us</h3>
      <ul>
        <li><a href="#"><i class="fab fa-facebook"></i></a></li>
        <li><a href="#"><i class="fab fa-twitter"></i></a></li>
        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
        <li><a href="#"><i class="fab fa-linkedin"></i></a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; 2024 Melodious. All rights reserved.</p>
    <ul>
      <li><a href="#">Privacy Policy</a></li>
      <li><a href="#">Terms of Service</a></li>
    </ul>
  </div>
</footer>


   
     </div>
     

       
    </>
    
  );
}

export default Home;
