import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import NavBar from './NavBar';
import '../CSS/library.css';

import library1 from '../Assets/Library1.jpg';
import library2 from '../Assets/Library2.jpg';
import library3 from '../Assets/Library3.jpg';
import ClassicalMusic from '../Assets/classicalSection.jpg';
import JazzSection from '../Assets/JazzSection.jpg';
import ArabicSection from '../Assets/ArabicSection.jpg';

function Library() {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchTableData = async () => {
    try {
      const response = await fetch('http://localhost:3001/table-data');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Fetch table data when component mounts
    fetchTableData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    filterTableData(event.target.value);
  };

  const filterTableData = (query) => {
    const filteredData = tableData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.artistName.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredData);
  };

  return (
    <div>
      <NavBar />

      <div className="container">
        <div className="overlay">
          <h1>Welcome to the Library!</h1>
        </div>
        <img className='container-img' src={library1} alt="library-1" />
        <img className='container-img' src={library2} alt="library-2" />
        <img className='container-img' src={library3} alt="library-3" />
      </div>

      {/* Search Bar */}
      <form>
        <div id="cover" className="searchBar">
          <input type="text" onChange={handleSearchChange} placeholder="Search by title, composer, or genre" />
          <button type="submit">
            <span id="s-circle"></span>
            <FaSearch /> {/* React-icons search icon */}
          </button>
        </div>
      </form>

       {searchQuery && searchResults.length > 0 ? (
        <div className='parent'>
          {searchResults.map((item, index) => (
             <div key={index} className="rectangle">
             <h2>{item.name}</h2>
             <img className="img" src={item.image} alt={item.name} />
             <p>Genre: {item.genre}</p>
             <p>Artist: {item.artistName}</p>
             <p>Date Published: {item.datePublished}</p>
             <button>Download</button>
         </div>
          ))}
        </div>
      ) : searchQuery ? (
        <p>No results found? Contact us <a href='mailto:antoun.atallah@lau.edu'> here</a> and send us the piece you want us to add.  </p>
      ) : null}

      <div>
        <h2>Or Search by Category</h2>
      </div>

      {/* Genre */}
      <div className='parent'>
        <Link to='/Classical' className='child'>
          <img src={ClassicalMusic} alt='classical tab'/>
          <p className="overlay-text">Classical</p>
        </Link>

        <Link to='/Jazz' className='child'>
          <img src={JazzSection} alt='Jazz tab'/>
          <p className="overlay-text">Jazz</p>
        </Link>

        <Link to='/Eastern' className='child'>
          <img src={ArabicSection} alt='Arabic tab'/>
          <p className="overlay-text">Eastern</p>
        </Link>
      </div>
    </div>
  );
}

export default Library;
