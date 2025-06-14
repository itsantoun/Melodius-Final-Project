import React, { useState, useEffect } from 'react';
import S3 from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk';

function FileUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [bucketItems, setBucketItems] = useState([]);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
  ];

  useEffect(() => {
    fetchBucketItems();
  }, []);

  const fetchBucketItems = async () => {
    const S3_BUCKET = "upload-music-sheets"; // Replace with your bucket name
    const REGION = "eu-west-3"; // Replace with your region

    AWS.config.update({
      accessKeyId: "AKIA3H3JD6S45FFKK247",
      secretAccessKey: "B7VL0VJyDbb9sRGx0iTaCaOyRdcyKa0prrxRbnT6",
    });

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    try {
      const data = await s3.listObjectsV2({ Bucket: S3_BUCKET }).promise();
      setBucketItems(data.Contents);
    } catch (error) {
      console.error("Error fetching bucket items:", error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setMessage('Invalid file type. Only images and PDFs are allowed.');
      }
    } else {
      setMessage('Please select a file.');
    }
  };

  // Upload a file

  const uploadFile = async () => {
    if (!file) {
      setMessage('Please choose a file.');
      return;
    }
    setUploading(true);
    const S3_BUCKET = "upload-music-sheets"; // Replace with your bucket name
    const REGION = "eu-west-3"; // Replace with your region

    AWS.config.update({
      accessKeyId: "AKIA3H3JD6S45FFKK247",
      secretAccessKey: "B7VL0VJyDbb9sRGx0iTaCaOyRdcyKa0prrxRbnT6",
    });

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    try {
      await s3.putObject(params).promise();
      setUploading(false);
      setMessage("File uploaded successfully.");
      setUploadedFiles([...uploadedFiles, { name: file.name, type: file.type }]);
      setFile(null); // Reset the file state to clear the file input
      fetchBucketItems(); // Refresh bucket items after upload
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Error uploading file: " + error.message); // Inform user about the error
    }
  };

  // Delete a File

  const deleteFile = async (fileName) => {
    const S3_BUCKET = "upload-music-sheets"; // Replace with your bucket name
    const REGION = "eu-west-3"; // Replace with your region

    AWS.config.update({
      accessKeyId: "AKIA3H3JD6S45FFKK247",
      secretAccessKey: "B7VL0VJyDbb9sRGx0iTaCaOyRdcyKa0prrxRbnT6",
    });

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    try {
      await s3.deleteObject(params).promise();
      console.log("File deleted successfully.");
      fetchBucketItems(); // Refresh bucket items after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

// Download a file
  const downloadFile = (fileName) => {
    const S3_BUCKET = "upload-music-sheets"; // Replace with your bucket name
    const REGION = "eu-west-3"; // Replace with your region

    AWS.config.update({
      accessKeyId: "AKIA3H3JD6S45FFKK247",
      secretAccessKey: "B7VL0VJyDbb9sRGx0iTaCaOyRdcyKa0prrxRbnT6",
    });

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        console.error("Error downloading file:", err);
        return;
      }
      const url = window.URL.createObjectURL(new Blob([data.Body]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  };


  // Preview the file
  const displayPreview = (fileName) => {
    const S3_BUCKET = "upload-music-sheets"; // Replace with your bucket name
    const REGION = "eu-west-3"; // Replace with your region

    AWS.config.update({
      accessKeyId: "AKIA3H3JD6S45FFKK247",
      secretAccessKey: "B7VL0VJyDbb9sRGx0iTaCaOyRdcyKa0prrxRbnT6",
    });

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    const existingPreview = document.getElementById("preview");
  if (existingPreview) {
    existingPreview.parentNode.removeChild(existingPreview);
  }

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error("Error fetching file:", err);
      return;
    }
    const url = URL.createObjectURL(new Blob([data.Body]));

    if (fileName.match(/\.pdf$/)) {
      // Display PDF preview using iframe
      const preview = document.createElement('iframe');
      preview.src = url;
      preview.id = "preview"; // Set an id for the preview element
      preview.style.width = "50%"; // Adjust width as needed
      preview.style.height = "500px"; // Adjust height as needed
      preview.style.border = "1px solid #ddd"; // Add border for better visibility
      document.body.appendChild(preview);
    } else {
      // Display image preview
      const preview = document.createElement('img');
      preview.src = url;
      preview.id = "preview"; // Set an id for the preview element
      preview.style.maxWidth = "200px"; // Adjust size as needed
      document.body.appendChild(preview);
    }
  });
};

  return (
    <>
      <div className="">
        <input type="file" required onChange={handleFileChange} />
        <button onClick={uploadFile}>{uploading ? 'Uploading...' : 'Upload File'}</button>
        {message && <p>{message}</p>}
      </div>
      
        <div>
          <h2>Uploaded Files</h2>
          <ul>
            {uploadedFiles.map((uploadedFile, index) => (
              <li key={index}>{uploadedFile.name}</li>
            ))}
          </ul>
        </div>
      
        <div>
          <h2>Available Documents</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>File type</th>
                <th>Actions</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {bucketItems.map((item, index) => (
               <tr key={index}>
               <td>{item.Key}</td>
               <td>{item.Key.split('.').pop()}</td> {/* Extracting file type from file name */}
               <td>
               <button onClick={() => downloadFile(item.Key)}>Download</button>
                 <button onClick={() => deleteFile(item.Key)}>Delete</button> 
               </td>
               <td>
                    {item.Key.match(/\.(jpeg|jpg|gif|png|pdf)$/) && (
                      <button onClick={() => displayPreview(item.Key)}>Preview</button>
                    )}
                  </td>
             </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  );
}

export default FileUploader;
