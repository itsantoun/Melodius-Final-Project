import React, { useState, useEffect } from 'react';
import './Sections.css';
import { FaSearch } from 'react-icons/fa';
import AWS from 'aws-sdk';

function Eastern() {
    const [tableData, setTableData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
        } catch (error) {
            console.error('Error fetching table data:', error);
        } finally {
            setTableLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = tableData.filter(item =>
        item.genre === 'Eastern' &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artistName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const downloadFromS3 = (fileName) => {
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
            <h1>Welcome to the </h1>
            <h2>Eastern Section</h2>
            <div id="cover" className="searchBar">
                <input
                    type="text"
                    onChange={handleSearchChange}
                    placeholder="Search by title or artist"
                    value={searchQuery}
                />
                <button type="submit">
                    <span id="s-circle"></span>
                    <FaSearch />
                </button>
            </div>
            {tableLoading && <p>Loading...</p>}
            {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                    <div key={index} className="rectangle">
                        <h2>{item.name}</h2>
                        <img
                            className="img"
                            src={item.preview_related || 'placeholder.jpg'} // Show preview image or placeholder
                            alt={item.name || 'No Image'}
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }} // Adjust styles as needed
                        />
                        <p>Genre: {item.genre}</p>
                        <p>Artist: {item.artistName}</p>
                        <p>Date Published: {item.datePublished}</p>
                        <button onClick={() => downloadFromS3(item.file_name)} className='download-button'>Download</button>
                    </div>
                ))
            ) : (
                <p>No results found? Contact us <a href='mailto:antoun.atallah@lau.edu'>here</a> to request a piece.</p>
            )}
        </div>
    );
}

export default Eastern;