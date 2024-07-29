import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";
function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create a temporary URL for the selected image
    const imageUrl = URL.createObjectURL(selectedFile);
    setImageSrc(imageUrl);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Store the response data in state
      setResponse(res.data);
      // alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (

    <div className="outer">

   <center>
   <div className="inner">

    
   
    <div className="App">
      <h1 className='image-upload'>Upload an Image to Get Results</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button className='custom-btn btn-1' onClick={handleUpload}>Upload</button>

     

      {response && (
        <div>
          {/* <h2>Response from Server:</h2> */}
          <h3><strong>Result:</strong> <h3 className='result'>{response.Prediction}</h3></h3>
          {/* <p>{response}</p> */}
        </div>
      )}
    </div>
    {imageSrc && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={imageSrc} alt="Uploaded" style={{ maxWidth: '30%', height: 'auto' }} />
        </div>
      )}
      </div> 
      </center>
    </div>
  );
}

export default App;
