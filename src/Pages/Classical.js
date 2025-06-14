import React, { useState, useEffect } from 'react';
import '../CSS/classical.css';
import { FaSearch } from 'react-icons/fa';
import classicalServices from '../Services/classical.services';


function Classical() {

  const [sheets, setSheets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    getSheets();
  }, []);

  const getSheets = async () => {
    const data = await classicalServices.getAllSheet();
    setSheets(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


  const handleSearch = (e) => {
    e.preventDefault();
    // Implement your search logic here
    // Filter the sheets based on the searchTerm
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div id="cover" className="searchBar">
          <input
            type="text"
            placeholder="Search by title, composer, or genre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <span id="s-circle"></span>
            <FaSearch /> {/* React-icons search icon */}
          </button>
        </div>
      </form>

      <h2>Sheet Music List</h2>
      <div>
    
      {sheets.map((sheet) => (
          <div key={sheet.id} className="rectangle">
          <p>{sheet.img && <img src={sheet.img} className='img' alt="Sheet Preview"/>}</p>
            <p><strong>Title:</strong> {sheet.title}</p>
            <p><strong>Composer: </strong>{sheet.composer}</p>
            <p><strong>Period:</strong> {sheet.period}</p>
            <button className='button'>Download PDF</button>
          </div>
        ))}
     
      </div>
    </div>
  );
}

export default Classical;
