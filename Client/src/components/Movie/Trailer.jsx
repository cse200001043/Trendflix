import React, { useRef, useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { connect } from 'react-redux';
import { getMainActions } from '../../app/actions/mainActions';
import './App.css';
import { Grid } from "@mui/material";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';




const Trailer = ({ trailerLink, getAmazonProducts }) => {

    // trailerLink = trailerLink.replace("/watch?v=", "/embed/");

    const VIDEO_PATH = require('../../video.mp4');
    // console.log(trailerLink);
    // const VIDEO_PATH = trailerLink;
    // console.log(trailerLink);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedFrame, setCapturedFrame] = useState(null);
    const [amazonProducts, setAmazonProducts] = useState([]);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');


        const handleTimeUpdate = async () => {
            if (video.paused) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const frameDataUrl = canvas.toDataURL('image/jpg'); // Specify the format
                console.log('frameDataUrl', frameDataUrl)
                setCapturedFrame(frameDataUrl);

                const data = {
                    frameDataUrl,
                }
                console.log(data.frameDataUrl.length)
                await getAmazonProducts(data, setAmazonProducts);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    useEffect(() => {
        console.log('amazonProducts', amazonProducts)
    }, [amazonProducts])



    const saveImageToServer = async (dataUrl) => {
        try {
            const response = await fetch('/api/save-image', {
                method: 'POST',
                body: JSON.stringify({ image: dataUrl }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Image saved successfully.');
            } else {
                console.error('Failed to save image.');
            }
        } catch (error) {
            console.error('Error saving image:', error);
        }
    };

    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };


    if (capturedFrame) {
        return (
            <div style={{ width: '70vw', position: 'relative', overflow: 'hidden' }}>

                <button className="burger-button" onClick={setCapturedFrame}>
                    X
                </button>

                <h2 style={{ textAlign: 'center' }}>Amazon Products</h2>
                <Grid container spacing={3} sx={{ p: 2 }}>
                    {amazonProducts.map((val) => {
                        return (
                            // { img_src = val["Image"] }
                            < Grid item xs={12} md={4} xl={4} sx={{height: '320'}}>
                                <Card style={{ backgroundColor: 'black', color: 'white' }}>
                                    <CardMedia
                                        sx={{ height: 160 }}
                                        image="data:image/jpeg;base64,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"
                                        title="green iguana"
                                    />
                                    <CardContent sx={{ height: 160 }}>
                                        <div className="card-body">
                                            <a href={"https://www.amazon.in/" + val.ImageData.url} className="btn btn-primary" style={{ textDecoration: 'none' }}><p>{val.ImageData.title}</p></a>
                                            <p><b>Price:</b> {val.ImageData.price}</p>
                                            <p>{val.ImageData.rating}</p>
                                            <p>{val.ImageData.reviews}</p>
                                        </div>
                                        {/* <Typography gutterBottom variant="h5" component="div">
                                        {val.ImageData.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                        <b>Price:</b> {val.ImageData.price}
                                        </Typography> */}
                                    </CardContent>
                                    {/* <CardActions style={{ justifyContent: 'center' }}>
                                        <Button size="medium"><a href={"https://www.amazon.in/" + val.ImageData.url} className="btn btn-primary" style={{textDecoration: 'none'}}>Shop Now</a></Button>
                                    </CardActions> */}
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </div >
        );
    }
    else {
        return (
            <div style={{ width: '70vw', heigh: '80vh', position: 'relative', overflow: 'hidden' }}>
                <video ref={videoRef} controls style={{ width: '100%', height: '100%' }}>
                    <source src={VIDEO_PATH} />
                </video>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div >
        );
    }
}

const mapActionsToProps = (dispatch) => {
    return {
        ...getMainActions(dispatch),
    };
};
export default connect(null, mapActionsToProps)(Trailer);