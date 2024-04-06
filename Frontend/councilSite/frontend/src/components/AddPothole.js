import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APILINK } from './App';
import { LoginContext } from './App';
import './styles/Register.css';



function AddPothole() {
    
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useContext(LoginContext)
    const [location, setLocation] = useState("");
    const [repairmentNeeded, setRepairmentNeeded] = useState(false);
    const [video, setVideo] = useState(null);
    const [severe_level, setSevereLevel] = useState("");
    const [image, setImage] = useState(null);

    // useEffect(() => {
    //     if (!loggedIn) {
    //         navigate("/")
    //     }
    //     console.log(loggedIn)
        
    // }, []);

    async function handleUpload() {
        
        // Create FormData object
        const formData = new FormData();
        const imageFileName = Date.now() + image.name;
        const videoFileName = Date.now() + video.name;
        formData.append("image", image, imageFileName);
        formData.append("video", video, videoFileName);
    
        try {
            // Make a separate request for image upload
            const imageFileUploadResponse = await fetch(`${APILINK}api/upload`, {
                method: 'POST',
                body: formData,
            });
    
            // Extract the imageFileName from the file upload response
            const imageFileUploadData = await imageFileUploadResponse.json();
            console.log(imageFileUploadData.message);

            if (imageFileUploadData.message === "Files uploaded successfully"){
                const savedImageFileName = imageFileUploadData.files.files[0].filename;
                const savedVideoFileName = imageFileUploadData.files.video[0].filename;
        
                // Prepare the data for creating a new pothole
                const postData = {
                    location,
                    video: savedVideoFileName,
                    image: savedImageFileName, 
                    severe_level,
                    repairment_needed: repairmentNeeded,
                };
        
                // Make the request to create a new pothole
                const potholeResponse = await fetch(`${APILINK}pothole/addNewPothole`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                });

                const uploadPotholeResponse = await potholeResponse.json();
                if (uploadPotholeResponse.error === "Internal Server Error") {
                    console.log(uploadPotholeResponse);
                }
                else{
                    console.log("Pothole created successfully");
                }
            }

        } catch (error) {
            console.error("Error uploading file or creating pothole", error);
        }
    }
    

    return (
        <header className="Register-header">
            <div className='Register-container'>
                <div className="Page-title">
                <p className="Register-title">Pothole Detection</p>
                <p className="Register-subtitle">Add Pothole</p>
                </div>
                <div className="Register-form-container">
                    <form className="Register-form" method='post'>
                        <label htmlFor="username" >Location:</label><br/>
                        <input 
                        type="text" 
                        id="username" 
                        name="location" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="Textfield"/><br/>

                        <label htmlFor="email">Video:</label><br/>
                        <label className="addVideo">
                            <span>Click here add Video</span>
                            <input
                                style={{ display: "none" }}
                                className="VideoInput_input"
                                type="file"
                                onChange={(e)=>setVideo(e.target.files[0])}
                                accept=".mov,.mp4"
                            />
                        </label><br/>

                        <label htmlFor="first-name">Image:</label><br/>

                        {image && (
                            <div className="shareImgContainer">
                                <img className="shareImg" src={URL.createObjectURL(image)} alt="" />
                            </div>
                        )}
                        <label htmlFor="file" className="shareOption">
                            <span className="shareOptionText">Click here to upload an image </span>
                            <input
                                style={{ display: "none" }}
                                type="file" multiple
                                id="file"
                                accept=".png,.jpeg,.jpg"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label><br /><br />

                        <label htmlFor="last-name">Severe level:</label><br/>
                        <input 
                        type="text" 
                        id="last-name" 
                        name="severe_level" 
                        value={severe_level}
                        onChange={(e) => setSevereLevel(e.target.value)}
                        className="Textfield"/><br/>

                        <label htmlFor="password">Repairment needed:</label><br/>
                        <input 
                        type="text" 
                        id="password" 
                        name="repairment_needed" 
                        value={repairmentNeeded}
                        onChange={(e) => setRepairmentNeeded(e.target.value)}
                        className="Textfield"/><br/>


                        <input type="button" value="Upload" className="Register-button" onClick={handleUpload}/>
                    </form>
                </div>
            </div>
        </header>
    );
}

export default AddPothole;