// import React, { useRef, useState, useEffect } from 'react';
// import { Buffer } from 'buffer';
// import { connect } from 'react-redux';
// import { getMainActions } from '../../app/actions/mainActions';


// const Trailer = ({ trailerLink, getAmazonProducts }) => {

//     // trailerLink = trailerLink.replace("/watch?v=", "/embed/");

//     // const VIDEO_PATH = require('../../video.mp4');
//     console.log(trailerLink);
//     const VIDEO_PATH = trailerLink;
//     // console.log(trailerLink);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [capturedFrame, setCapturedFrame] = useState(null);
//     const [amazonProducts, setAmazonProducts] = useState([]);

//     useEffect(() => {
//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         const data = {
//             frameDataUrl:""
//         }
//         getAmazonProducts(data, setAmazonProducts);

//         const handleTimeUpdate = () => {
//             if (video.paused) {
//                 canvas.width = video.videoWidth;
//                 canvas.height = video.videoHeight;
//                 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//                 const frameDataUrl = canvas.toDataURL('image/jpg'); // Specify the format
//                 setCapturedFrame(frameDataUrl);

//                 // getAmazonProducts(frameDataUrl, setAmazonProducts);
//                 // // Automatically trigger the download
//                 // const a = document.createElement('a');
//                 // a.href = frameDataUrl;
//                 // a.download = './captured_frame.jpg'; // Specify the file name and format
//                 // a.click();

//                 // const fs = require('fs');

//                 // Assuming frameDataUrl is a base64-encoded image data (e.g., data URL)
//                 // const frameDataUrl = 'data:image/jpeg;base64,iVBORw0KG...'; // Replace with your image data

//                 // Specify the local file path where you want to save the image
//                 // const localFilePath = require('./image.jpg');
//                 // console.log("localFilePath", localFilePath);

//                 // // Remove the data URL prefix (e.g., 'data:image/jpeg;base64,')
//                 // const base64Data = frameDataUrl.replace(/^data:image\/\w+;base64,/, '');
//                 // console.log(base64Data);

//                 // Convert the base64 data to a binary buffer
//                 // const imageBuffer = Buffer.from(base64Data, 'base64');

//                 // var imagedata // get imagedata from POST request 
//                 // fs.writeFile("/images/file.png", base64Data, 'binary', function (err) {
//                 //     console.log("The file was saved!");

//                 // });


//                 // // Write the buffer to the local file
//                 // fs.writeFile(localFilePath, base64Data, 'binary', (err) => {
//                 //     if (err) {
//                 //         console.error('Error saving the image:', err);
//                 //     } else {
//                 //         console.log('Image saved successfully to', localFilePath);
//                 //     }
//                 // });

//             }
//         };

//         video.addEventListener('timeupdate', handleTimeUpdate);

//         return () => {
//             video.removeEventListener('timeupdate', handleTimeUpdate);
//         };
//     }, []);

//     const saveImageToServer = async (dataUrl) => {
//         try {
//             const response = await fetch('/api/save-image', {
//                 method: 'POST',
//                 body: JSON.stringify({ image: dataUrl }),
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 console.log('Image saved successfully.');
//             } else {
//                 console.error('Failed to save image.');
//             }
//         } catch (error) {
//             console.error('Error saving image:', error);
//         }
//     };

//     return (
//         <div>
//             <video ref={videoRef}  controls width="1070" height="600" >
//                 <source src={trailerLink}  />
//             </video>
//             <canvas ref={canvasRef} style={{ display: 'none' }} />
//             {capturedFrame && (
//                 <div>
//                     <h2>Captured Frame:</h2>
//                     <img src={capturedFrame} alt="Captured Frame" />
//                 </div>
//             )}
//         </div>
//     );
// }

// const mapActionsToProps = (dispatch) => {
//     return {
//       ...getMainActions(dispatch),
//     };
//   };
//   export default connect(null, mapActionsToProps)(Trailer);
  
  
  
  
  
  
  
  
  
  
  
  
  

//   import React, { useRef, useState, useEffect } from 'react';
// import { Buffer } from 'buffer';
// import YouTubePlayer from "youtube-player"


// const Trailer = ({ trailerLink }) => {

//     // trailerLink = trailerLink.replace("/watch?v=", "/embed/");

//     // const VIDEO_PATH = require('../../video.mp4');
//     console.log(trailerLink);
//     const VIDEO_PATH = trailerLink;
//     // console.log(trailerLink);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [capturedFrame, setCapturedFrame] = useState(null);

//     useEffect(() => {
//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         const player = YouTubePlayer("video-player",{
//             videoId:"u5r77-OQwa8"
//         })
//         player.on('stateChange', (event) => {
//             if (event.data === 2) {
//               const video = videoRef.current;
      
//               // Wait for the video to load its metadata
//               video.onloadedmetadata = () => {
//                 canvas.width = video.videoWidth;
//                 canvas.height = video.videoHeight;
//                 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
//                 const frameDataUrl = canvas.toDataURL('image/jpg'); // Specify the format as 'image/jpeg'
//                 console.log('frameDataUrl', frameDataUrl);
//                 setCapturedFrame(frameDataUrl);
//               };
//             }
//           });

//         // const handleTimeUpdate = () => {
//         //     if (video.paused) {
//         //         canvas.width = video.videoWidth;
//         //         canvas.height = video.videoHeight;
//         //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         //         const frameDataUrl = canvas.toDataURL('image/jpg'); // Specify the format
//         //         setCapturedFrame(frameDataUrl);

//         //         // // Automatically trigger the download
//         //         // const a = document.createElement('a');
//         //         // a.href = frameDataUrl;
//         //         // a.download = './captured_frame.jpg'; // Specify the file name and format
//         //         // a.click();

//         //         const fs = require('fs');

//         //         // Assuming frameDataUrl is a base64-encoded image data (e.g., data URL)
//         //         // const frameDataUrl = 'data:image/jpeg;base64,iVBORw0KG...'; // Replace with your image data

//         //         // Specify the local file path where you want to save the image
//         //         const localFilePath = require('./image.jpg');
//         //         console.log("localFilePath", localFilePath);

//         //         // Remove the data URL prefix (e.g., 'data:image/jpeg;base64,')
//         //         const base64Data = frameDataUrl.replace(/^data:image\/\w+;base64,/, '');
//         //         console.log(base64Data);

//         //         // Convert the base64 data to a binary buffer
//         //         // const imageBuffer = Buffer.from(base64Data, 'base64');

//         //         // var imagedata // get imagedata from POST request 
//         //         // fs.writeFile("/images/file.png", base64Data, 'binary', function (err) {
//         //         //     console.log("The file was saved!");

//         //         // });


//         //         // // Write the buffer to the local file
//         //         // fs.writeFile(localFilePath, base64Data, 'binary', (err) => {
//         //         //     if (err) {
//         //         //         console.error('Error saving the image:', err);
//         //         //     } else {
//         //         //         console.log('Image saved successfully to', localFilePath);
//         //         //     }
//         //         // });

//         //     }
//         // };

//         // video.addEventListener('timeupdate', handleTimeUpdate);

//         // return () => {
//         //     video.removeEventListener('timeupdate', handleTimeUpdate);
//         // };
//     }, []);

//     const saveImageToServer = async (dataUrl) => {
//         try {
//             const response = await fetch('/api/save-image', {
//                 method: 'POST',
//                 body: JSON.stringify({ image: dataUrl }),
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 console.log('Image saved successfully.');
//             } else {
//                 console.error('Failed to save image.');
//             }
//         } catch (error) {
//             console.error('Error saving image:', error);
//         }
//     };

//     return (
//         <div>
//             {/* <video ref={videoRef}  controls width="1070" height="600" >
//                 <source src={trailerLink}  />
//             </video> */}
//             <div id="video-player" ref={videoRef}></div>
//             <canvas ref={canvasRef} style={{ display: 'none' }} />
//             {capturedFrame && (
//                 <div>
//                     <h2>Captured Frame:</h2>
//                     <img src={capturedFrame} alt="Captured Frame" />
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Trailer;