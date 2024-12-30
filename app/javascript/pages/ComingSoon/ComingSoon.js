import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import Grid from '@mui/material/Grid2';
import LandingHeader from '../../components/landingpage/LandingHeader';
import { Link } from 'react-router-dom';

const ComingSoon = () => {

    return (
        <Box
            sx={{
                width: '100%', // Full width of the parent container
                alignItems: 'center',
                justifyContent: 'center',
                px: 0, // Horizontal padding
            }}
        >
            <LandingHeader sourcePage={'ComingSoon'} />
            <Box
                sx={{
                    width: '100%',
                    height: '25vh',
                    bgcolor: '#e0f7fa',
                    position: 'relative',
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h3" component="div" align="center" fontWeight="bold">
                    Coming Soon...
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 3, fontSize: '1rem', fontStyle: 'italic' }}>
                    We are hard at work to bring you the following features. Stay tuned!
                </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center', width: '80%', mx: 'auto' }}>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/newfeature1.jpg"
                            title="new feature 1"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Feature 1
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Description of feature 1.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/newfeature2.jpg"
                            title="new feature 2"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Feature 2
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Description of feature 2.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/newfeature3.png"
                            title="new feature 3"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Feature 3
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Description of feature 3.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/newfeature2.jpg"
                            title="new feature 4"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Feature 4
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Description of feature 4.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/newfeature3.png"
                            title="new feature 5"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Feature 5
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Description of feature 5.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/newfeature1.jpg"
                            title="new feature 6"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Feature 6
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Description of feature 6.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ComingSoon;