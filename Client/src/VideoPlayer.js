// // import React, { useRef, useState, useEffect } from 'react';
// // import { Buffer } from 'buffer';
// // import { connect } from 'react-redux';
// // import { getMainActions } from '../../app/actions/mainActions';


// // const Trailer = ({ trailerLink, getAmazonProducts }) => {

// //     // trailerLink = trailerLink.replace("/watch?v=", "/embed/");

// //     const VIDEO_PATH = require('../../video.mp4');
// //     // console.log(trailerLink);
// //     // const VIDEO_PATH = trailerLink;
// //     // console.log(trailerLink);
// //     const videoRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const [capturedFrame, setCapturedFrame] = useState(null);
// //     const [amazonProducts, setAmazonProducts] = useState([]);

// //     useEffect(() => {
// //         const video = videoRef.current;
// //         const canvas = canvasRef.current;
// //         const ctx = canvas.getContext('2d');


// //         const handleTimeUpdate = async () => {
// //             if (video.paused) {
// //                 canvas.width = video.videoWidth;
// //                 canvas.height = video.videoHeight;
// //                 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// //                 const frameDataUrl = canvas.toDataURL('image/jpg'); // Specify the format
// //                 console.log('frameDataUrl', frameDataUrl)
// //                 setCapturedFrame(frameDataUrl);

// //                 const data = {
// //                     frameDataUrl,
// //                 }
// //                 console.log(data.frameDataUrl.length)
// //                 await getAmazonProducts(data, setAmazonProducts);
// //             }
// //         };

// //         video.addEventListener('timeupdate', handleTimeUpdate);

// //         return () => {
// //             video.removeEventListener('timeupdate', handleTimeUpdate);
// //         };
// //     }, []);

// //     useEffect(() => {
// //         console.log('amazonProducts', amazonProducts)
// //     }, [amazonProducts])


// //     const saveImageToServer = async (dataUrl) => {
// //         try {
// //             const response = await fetch('/api/save-image', {
// //                 method: 'POST',
// //                 body: JSON.stringify({ image: dataUrl }),
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //             });

// //             if (response.ok) {
// //                 console.log('Image saved successfully.');
// //             } else {
// //                 console.error('Failed to save image.');
// //             }
// //         } catch (error) {
// //             console.error('Error saving image:', error);
// //         }
// //     };

// //     return (
// //         <div>
// //             <video ref={videoRef} controls width="1070" height="600" >
// //                 <source src={VIDEO_PATH} />
// //             </video>
// //             <canvas ref={canvasRef} style={{ display: 'none' }} />
// //             {capturedFrame && (
// //                 <div>
// //                     {/* <h2>Captured Frame:</h2>
// //                     <img src={capturedFrame} alt="Captured Frame" /> */}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// // const mapActionsToProps = (dispatch) => {
// //     return {
// //         ...getMainActions(dispatch),
// //     };
// // };
// // export default connect(null, mapActionsToProps)(Trailer);
// import React, { useState } from 'react';
// import {
//     MDBIcon,
//     MDBBtn,
//     MDBSideNav,
//     MDBSideNavItem,
//     MDBSideNavLink,
//     MDBSideNavMenu,
//     MDBSideNavCollapse
// } from 'mdb-react-ui-kit';

// export default function App() {
//     const [basicOpen, setBasicOpen] = useState(true);
//     const [basicCollapse1, setBasicCollapse1] = useState(true);
//     const [basicCollapse2, setBasicCollapse2] = useState(false);

//     return (
//         <>
//             <MDBSideNav isOpen={basicOpen} absolute getOpenState={(e) => setBasicOpen(e)}>
//                 <MDBSideNavMenu>
//                     <MDBSideNavItem>
//                         <MDBSideNavLink>
//                             <MDBIcon far icon='smile' className='fa-fw me-3' />
//                             <span className='sidenav-non-slim'>Link 1</span>
//                         </MDBSideNavLink>
//                     </MDBSideNavItem>
//                     <MDBSideNavItem>
//                         <MDBSideNavLink
//                             icon='angle-down'
//                             shouldBeExpanded={basicCollapse1}
//                             onClick={() => setBasicCollapse1(!basicCollapse1)}
//                         >
//                             <MDBIcon fas icon='grin' className='fa-fw me-3' />
//                             <span className='sidenav-non-slim'>Category 1</span>
//                         </MDBSideNavLink>
//                         <MDBSideNavCollapse show={basicCollapse1}>
//                             <MDBSideNavLink>Link 2</MDBSideNavLink>
//                             <MDBSideNavLink>Link 3</MDBSideNavLink>
//                         </MDBSideNavCollapse>
//                     </MDBSideNavItem>
//                     <MDBSideNavItem>
//                         <MDBSideNavLink
//                             icon='angle-down'
//                             shouldBeExpanded={basicCollapse2}
//                             onClick={() => setBasicCollapse2(!basicCollapse2)}
//                         >
//                             <MDBIcon fas icon='grin' className='fa-fw me-3' />
//                             Category 2
//                         </MDBSideNavLink>
//                         <MDBSideNavCollapse show={basicCollapse2}>
//                             <MDBSideNavLink>Link 4</MDBSideNavLink>
//                             <MDBSideNavLink>Link 5</MDBSideNavLink>
//                         </MDBSideNavCollapse>
//                     </MDBSideNavItem>
//                 </MDBSideNavMenu>
//             </MDBSideNav>

//             <div style={{ padding: '20px' }} className='text-center'>
//                 <MDBBtn onClick={() => setBasicOpen(!basicOpen)}>
//                     <MDBIcon fas icon='bars' />
//                 </MDBBtn>
//             </div>
//         </>
//     );
// }
