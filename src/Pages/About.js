import React from 'react'
import NavBar from './NavBar'
import me2 from '../Assets/me2.png'
import '../CSS/about.css'

function About() {
  return (
  
    <div>
  <NavBar/>
    <div className="landing-page">
      <div className="landing-content">
        <div >
          <h1>Hi Everyone</h1>
          <p className="description"  >My name is Antoun Atallah, an upcoming graduate Computer Science
            at the <a href='https://www.lau.edu.lb'>Lebanese American Univeristy.</a> I am also a pianist with a Baccalaureat degree from the <a href='https://www.conservatory.gov.lb'> Lebanese Higher National conservatory of Music</a> and have a strong
            passion for both coding and music. So for my final project I decided to create a website that 
            would fit both of my interests in one big Project.

            The concept of this website is to connect musiscians from around the globe, and dedicate this
            website only for musers and singers as well! Where they can meet and collab with each other!
            So Thank you for visiting my website and hope you enjoy it :)
          </p>
          
        </div>
        <div className="img-container">
          <img className="img-container" src={me2} alt="Your Image" />
        </div>
        </div> 
      </div>
      </div>
    
  )
}

export default About