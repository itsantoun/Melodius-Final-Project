import React, { useState, useEffect } from 'react';
import './AddSheets.css';
import AWS from 'aws-sdk';


function AddSheets() {
  const [formData, setFormData] = useState({ name: '', genre: '', artistName: '', datePublished: '' });
  const [tableData, setTableData] = useState([]);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Add this state
  const [bucketContents, setBucketContents] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);


  const [bucketFileNames, setBucketFileNames] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const submitFormData = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log(responseData);
      // Refresh the table data after submitting the form
      fetchTableData();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handlePreviewImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setPreviewImage(selectedImage);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     let formDataWithFile = { ...formData };
  
  //     const uploadPromises = [];
  
  //     // Upload the main file
  //     if (file) {
  //       uploadPromises.push(
  //         uploadFileToS3(file).then((fileKey) => {
  //           formDataWithFile.file_name = fileKey;
  //         })
  //       );
  //     }
  
  //     // Upload the preview image
  //     if (previewImage) {
  //       uploadPromises.push(
  //         uploadFileToS3(previewImage).then((previewKey) => {
  //           formDataWithFile.preview_related = previewKey;
  //         })
  //       );
  //     }
  
  //     // Wait for all uploads to complete
  //     await Promise.all(uploadPromises);
  
  //     // Submit form data to the server
  //     submitFormData(formDataWithFile);
  
  //     // Reset states
  //     setFormData({ name: '', genre: '', artistName: '', datePublished: '' });
  //     setFile(null);
  //     setPreviewImage(null);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        let formDataWithFile = { ...formData };

        const uploadPromises = [];

        // Upload the main file
        if (file) {
            uploadPromises.push(
                uploadFileToS3(file).then((fileKey) => {
                    formDataWithFile.file_name = fileKey;
                })
            );
        }

        // Upload the preview image
        if (previewImage) {
            uploadPromises.push(
                uploadFileToS3(previewImage).then((previewKey) => {
                    formDataWithFile.preview_related = previewKey;
                })
            );
        }

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);

        // Submit form data to the server
        submitFormData(formDataWithFile);

        // Reset states
        setFormData({ name: '', genre: '', artistName: '', datePublished: '' });
        setFile(null);
        setPreviewImage(null);
    } catch (error) {
        console.error('Error:', error);
    }
};

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
      
    }finally{
      setTableLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:3001/delete/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      console.log("Record deleted");
      fetchTableData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Fetch table data when component mounts
    retrieveBucketFileNames().then(fileNames => setBucketFileNames(fileNames));
    fetchTableData();
    fetchBucketContents();
  }, []);

  // Function to upload file to S3 bucket
//   const uploadFileToS3 = async (fileToUpload) => {
//     const S3_BUCKET = "upload-music-sheets";
//     const REGION = "eu-west-3";

//     AWS.config.update({
//         accessKeyId: 'AKIA3H3JD6S4V7DQQAPJ',
//         secretAccessKey: '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',
//         region: REGION,
//     });

//     if (!fileToUpload || !fileToUpload.name) {
//         throw new Error("No file selected for upload or file is invalid.");
//     }

//     const s3 = new AWS.S3({
//         region: REGION,
//     });

//     const params = {
//         Bucket: S3_BUCKET,
//         Key: fileToUpload.name, // Use the file name
//         Body: fileToUpload, // File content
//         ContentType: fileToUpload.type, // MIME type of the file
//     };

//     try {
//         console.log("Uploading file to S3 with params:", params);
//         const upload = await s3.putObject(params).promise();
//         console.log("Upload successful:", upload);
//         return fileToUpload.name; // Return the file name as the S3 key
//     } catch (error) {
//         console.error("Error uploading file to S3:", error);
//         throw error;
//     }
// };


const uploadFileToS3 = async (fileToUpload) => {
  const S3_BUCKET = "upload-music-sheets";
  const REGION = "eu-west-3";

  AWS.config.update({
      accessKeyId: 'AKIA3H3JD6S4V7DQQAPJ',
      secretAccessKey: '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',
      region: REGION,
  });

  if (!fileToUpload || !fileToUpload.name) {
      throw new Error("No file selected for upload or file is invalid.");
  }

  const s3 = new AWS.S3({
      region: REGION,
  });

  const params = {
      Bucket: S3_BUCKET,
      Key: fileToUpload.name, // Use the correct file name
      Body: fileToUpload, // File content
      ContentType: fileToUpload.type, // MIME type of the file
  };

  try {
      console.log("Uploading file to S3 with params:", params);
      const upload = await s3.putObject(params).promise();
      console.log("Upload successful:", upload);
      return fileToUpload.name; // Return the file name as the S3 key
  } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
  }
};

  // Function to fetch bucket contents
  const fetchBucketContents = async () => {
    const S3_BUCKET = "upload-music-sheets";
    const REGION = "eu-west-3";

    AWS.config.update({
      accessKeyId: 'AKIA3H3JD6S4V7DQQAPJ',
        secretAccessKey: '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',

    });



    const s3 = new AWS.S3({
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
    };

    try {
      const data = await s3.listObjectsV2(params).promise();
      setBucketContents(data.Contents);
    } catch (error) {
      console.error('Error listing bucket contents:', error);
    }
  };

  // Function to delete file from S3 bucket
  const deleteFileFromS3 = async (fileName) => {
    const S3_BUCKET = "upload-music-sheets";
    const REGION = "eu-west-3";

    AWS.config.update({
      accessKeyId: 'AKIA3H3JD6S4V7DQQAPJ',
        secretAccessKey: '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',

    });


    const s3 = new AWS.S3({
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    try {
      await s3.deleteObject(params).promise();
      alert("File deleted successfully.");
      fetchBucketContents(); // Refresh bucket contents after deletion
    } catch (error) {
      console.error('Error deleting file:', error);
      alert("Error deleting file: " + error.message);
    }
  };


  const downloadFileFromS3 = async (fileName) => {
    const S3_BUCKET = "upload-music-sheets";
    const REGION = "eu-west-3";

    AWS.config.update({
      accessKeyId: 'AKIA3H3JD6S4V7DQQAPJ',
        secretAccessKey: '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',
    });

    const s3 = new AWS.S3({
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    try {
      const data = await s3.getObject(params).promise();
      const url = window.URL.createObjectURL(new Blob([data.Body]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert("Error downloading file: " + error.message);
    }
  };

   const retrieveBucketFileNames = async () => {
    try {
      const S3_BUCKET = "upload-music-sheets";
      const REGION = "eu-west-3";
  
      AWS.config.update({
        accessKeyId: 'AKIA3H3JD6S4V7DQQAPJ',
        secretAccessKey: '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',
      });
  
      const s3 = new AWS.S3({ region: REGION });
  
      const params = { Bucket: S3_BUCKET };
  
      const data = await s3.listObjectsV2(params).promise();
      const fileNames = data.Contents.map(item => item.Key);
      return fileNames;
    } catch (error) {
      console.error('Error retrieving bucket file names:', error);
      throw error;
    }
  };

  return (
    <>
    <div className='container'>
      <div className='form-container'>
        <h2>Add Sheets</h2>
        <form onSubmit={handleSubmit}>
          <div className='name'>
            <label htmlFor='name'>Enter Name:</label>
            <input type='text' name='name' onChange={handleChange} value={formData.name}/>
          </div>

          <div className='artistName'>
            <label htmlFor='artistName'>Enter Artist Name:</label>
            <input type='text' name='artistName' onChange={handleChange} value={formData.artistName}/>
          </div>

          <div className='genre'>
            <label htmlFor='genre'>Enter Genre:</label>
            <input type='text' name='genre' onChange={handleChange} value={formData.genre}/>
          </div>

          <div className='datePublished'>
            <label htmlFor='datePublished'>Enter the date/Period:</label>
            <label htmlFor='datePublished'>ex: Classical period/ datePublished ex: 12-2-2001</label>
            <input type='text' name='datePublished' onChange={handleChange} value={formData.datePublished}/>
          </div>

          <div>
            <input id="file-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <div>
            <label htmlFor="preview-input">Upload Preview Image:</label>
            <input id="preview-input" type="file" accept="image/*" onChange={handlePreviewImageChange} />
          </div>

          <div className='submit'>
            <input type='submit' value='Submit'/>
          </div>
        </form>
      </div>
      <div className='table-container'>
        <h2>Table Content</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Artist Name</th>
              <th>Genre</th>
              <th>Date Published</th>
              <th>File Related Published</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {tableLoading ? (
    <tr>
      <td colSpan="6">Loading table data...</td>
    </tr>
  ) : (
   tableData.map((item, index) => (
  <tr key={index}>
    <td>{item.name}</td>
    <td>{item.artistName}</td>
    <td>{item.genre}</td>
    <td>{item.datePublished}</td>
    <td>{item.file_name || 'N/A'}</td>
    <td>
      <button onClick={() => handleDelete(item.id)}>Delete</button>
      {item.file_name && (
            <button onClick={() => downloadFileFromS3(item.file_name)}>Download From S3</button>
          )}
    </td>
  </tr>
    ))
  )}
</tbody>
        </table>
      </div>

      <div>
        <h2>Bucket Contents</h2>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Last Modified</th>
              <th>File Size (bytes)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bucketContents.map((item, index) => (
              <tr key={index}>
                <td>{item.Key}</td>
                <td>{new Date(item.LastModified).toLocaleString()}</td>
                <td>{item.Size}</td>
                <td><button onClick={() => deleteFileFromS3(item.Key)}>Delete</button>
                <br></br>
                <button onClick={() => downloadFileFromS3(item.Key)}>Download</button>
                </td>
                
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
    </>
  );
}

export default AddSheets;
