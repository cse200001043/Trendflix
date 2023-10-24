import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getMainActions } from '../../app/actions/mainActions';
import './App.css';
import { Grid, Box, CircularProgress } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';

const Trailer = ({ trailerLink, getAmazonProducts }) => {

    const VIDEO_PATH = require('../../video.mp4');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedFrame, setCapturedFrame] = useState(null);
    const [amazonProducts, setAmazonProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');


        const handleTimeUpdate = async () => {
            if (video.paused) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const frameDataUrl = canvas.toDataURL('image/jpg');
                setCapturedFrame(frameDataUrl);

                const data = {
                    frameDataUrl,
                }
                setIsLoading(true);
                await getAmazonProducts(data, setAmazonProducts);
                setIsLoading(false);
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
        if (isLoading) {
            return (
                <div style={{ width: '70vw', position: 'relative' }}>
                    <button className="burger-button" onClick={setCapturedFrame}>
                        X
                    </button>
                    <h2 style={{ textAlign: 'center' }}>Amazon Products</h2>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "30vh",
                        }}
                    >
                        <CircularProgress size={50} color="primary" />
                    </Box>
                </div >
            );
        }
        else {
            return (
                <div style={{ width: '70vw', position: 'relative', overflow: 'hidden' }}>
                    {/* <button className="burger-button" onClick={setCapturedFrame}>
                        X
                    </button> */}
                    <h2 style={{ textAlign: 'center' }}>Amazon Products</h2>
                    <Grid container spacing={3} sx={{ p: 2 }}>
                        {amazonProducts.map((val) => {
                            return (
                                < Grid item xs={12} md={4} xl={4} sx={{ height: '320' }}>
                                    <Card style={{ backgroundColor: 'black', color: 'white' }}>
                                        <CardMedia
                                            sx={{ height: 160 }}
                                            image={val.ImageData['img_src']}
                                            title="green iguana"
                                        />
                                        <CardContent sx={{ height: 130 }}>
                                            <div className="card-body">
                                                <a href={"https://www.amazon.in/" + val.ImageData.url} className="btn btn-primary" style={{ textDecoration: 'none' }}><h4 style={{ marginTop: '5px', marginBottom: '10px' }}>{val.ImageData.title}</h4></a>

                                                <p style={{ marginLeft: '10px' }}><b>Price:</b> {val.ImageData.price}</p>

                                                <div style={{ marginLeft: '9px' }}>
                                                    {[...Array(5)].map((item, index) => {
                                                        const givenRating = index + 1;
                                                        const rating = parseInt(val.ImageData.rating.substring(0, 3), 10)
                                                        let color = "silver"
                                                        if (givenRating < rating || givenRating === rating) {
                                                            color = "yellow"
                                                        }
                                                        return (
                                                            <label>
                                                                <StarIcon style={{ color: color }} />
                                                            </label>
                                                        );
                                                    })}
                                                    <span aria-label={val.ImageData.reviews}><span class="a-size-base s-underline-text">{val.ImageData.reviews}</span> </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardActions style={{ justifyContent: 'center' }}>
                                            <Button size="medium"><a href={"https://www.amazon.in/" + val.ImageData.url} className="btn btn-primary" style={{ textDecoration: 'none' }}>Shop Now</a></Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div >
            );
        }
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