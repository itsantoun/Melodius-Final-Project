import React from 'react'
import logoMelodius from '../Assets/logoMelodious.jpg'
import '../CSS/about.css'

function About() {
  return (
  
    <div>
  {/* <NavBar/> */}
    <div className="landing-page">
      <div className="landing-content">
        <div >
          <h1>Welcome to Melodius</h1>
          <p className="description"  >The Music Network is a web application that caters to the needs of all musicians, composers, and producers in a way which no other online medium has ever sought to do. Professional networking in the music world today has become very important if one wants to grow or succeed in his vocation. Still, none of these currently available platforms-like LinkedIn-offer ideal conditions and opportunities for musicians. This is where the platform fills the void by allowing a place that is personally owned by each musician, to showcase their talent and artistic expression, share one's work, and network.
It provides a home for a musician of any rank, providing the place they need to take their work to the next level. Profiles are long, featuring portfolios and even endorsements from colleagues to build up one's reputation. Advanced search-and-network facilities make it easy to find colleagues, collaborators, industry pros, or even potential employers based on genre, instrument, and skill level.
Advanced collaboration allows for the facility of a web-based workspace for projects, thereby allowing students to create projects and build on those projects with their peers in real-time; its music library feature will let users store their compositions and recordings, share them, and solicit feedback. It lets music become the center for all your music activities.
     </p>
          
        </div>
        <div className="img-container">
          <img className="img-container" src={logoMelodius} alt="Your Image" />
        </div>
        </div> 
      </div>
      </div>
    
  )
}

export default About