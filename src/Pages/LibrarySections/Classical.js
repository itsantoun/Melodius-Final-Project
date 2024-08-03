import React, { useState, useEffect } from 'react';
import './Sections.css';
import { FaSearch } from 'react-icons/fa';
import NavBar from '../NavBar';
import AWS from 'aws-sdk';

function Classical() {
    const [formData, setFormData] = useState({ name: '', genre: '', artistName: '', datePublished: '' });
    const [tableData, setTableData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        // Fetch table data when component mounts
        fetchTableData();
    }, []);

    const fetchTableData = async () => {
        try {
            setTableLoading(true);
            const response = await fetch('http://localhost:3001/table-data');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTableData(data);
            setFormData({ name: '', genre: '', artistName: '', datePublished: '' });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setTableLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = tableData.filter(item =>
        item.genre === 'Classical' &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artistName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const downloadFromS3 = (fileName) => {
        setDownloading(true);
        const S3_BUCKET = "upload-music-sheets";
        const REGION = "eu-west-3";
        
        // Configure AWS SDK
        AWS.config.update({
            accessKeyId: 'AKIA3H3JD6S4V7DQQAPJ',
        secretAccessKey: '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',
            region: REGION
        });
        
        // Create S3 instance
        const s3 = new AWS.S3();
        
        // Prepare params for getObject operation
        const params = {
            Bucket: S3_BUCKET,
            Key: fileName
        };
        
        // Get object from S3
        s3.getObject(params, (err, data) => {
            setDownloading(false);
            if (err) {
                console.error('Error downloading file from S3:', err);
            } else {
                // Create a temporary URL for downloading the file
                const url = URL.createObjectURL(new Blob([data.Body]));
                
                // Create a temporary link element
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                
                // Simulate click on the link to start downloading
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                document.body.removeChild(link);
            }
        });
    };

    return (
        <div>
            <NavBar/>
            <h1>Welome to the </h1>
            <h2>Classical Section</h2>
            <div id="cover" className="searchBar">
                <input 
                    type="text" 
                    onChange={handleSearchChange} 
                    placeholder="Search by title or artist" 
                    value={searchQuery} 
                />
                <button type="submit">
                    <span id="s-circle"></span>
                    <FaSearch /> {/* React-icons search icon */}
                </button>
            </div>
            {tableLoading && <p>Loading...</p>}
            {downloading && <p>Downloading...</p>}
            {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                    <div key={index} className="rectangle">
                        <h2>{item.name}</h2>
                        <img className="img" src={item.image} alt={item.name} />
                        <p>Genre: {item.genre}</p>
                        <p>Artist: {item.artistName}</p>
                        <p>Date Published: {item.datePublished}</p>
                        <button onClick={() => downloadFromS3(item.file_name)}>Download</button>
                    </div>
                ))
            ) : (
                <p>No results found? Contact us <a href='mailto:antoun.atallah@lau.edu'> here</a> and send us the piece you want us to add.  </p>
            )}
        </div>
    );
}

export default Classical;
