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
                    height: '40vh',
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
                            image="/assetclasses.jpeg"
                            title="new feature 1"
                        />
                        <CardContent sx={{ pb: 1 }}>
                            <Typography variant="h5" component="div">
                                New Asset Classes 
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <ul>
                                    <li>Able to add Commodities (Gold/Silver) to Assets and Dreams.</li>
                                    <li>Calculators for Retirement funds like PPF & CPF</li>
                                </ul>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/insurance.jpeg"
                            title="new feature 2"
                        />
                        <CardContent sx={{ pb: 1 }}>
                            <Typography variant="h5" component="div">
                                Insurance
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <ul>
                                    <li>Add Life, Health and Others insurance coverage</li>
                                    <li>Check appropriate coverage based on liabilities.</li>
                                    <li>Gain insights on the right coverage for you and in case of emergencies.</li>
                                </ul>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/notifications.jpeg"
                            title="new feature 3"
                        />
                        <CardContent sx={{ pb: 1 }}>
                            <Typography variant="h5" component="div">
                                Portfolio Management & Notifications
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <ul>
                                    <li>Mark-To-Market for Investment Portfolios</li>
                                    <li>Notifications for upcoming payments, maturity of investments, etc.</li>
                                    <li>Insights on the performance of your investments.</li>
                                </ul>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/insightsanalytics.jpeg"
                            title="new feature 4"
                        />
                        <CardContent sx={{ pb: 1 }}>
                            <Typography variant="h5" component="div">
                                Further Insights & Analytics
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <ul>
                                    <li>Insights on your expenses vs income</li>
                                    <li>Insights on loans and liabilities</li>
                                </ul>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/onlinecalculators.jpeg"
                            title="new feature 5"
                        />
                        <CardContent sx={{ pb: 1 }}>
                            <Typography variant="h5" component="div">
                                Easy to use Calculators
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <ul>
                                    <li>Calculators for Retirement funds like PPF & CPF</li>
                                    <li>Calculators for loans and EMI payments</li>
                                    <li>Time Value of Money Calculators</li>
                                    <li>Investment Calculators</li>
                                </ul>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={4} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ width: '80%' }}>
                        <CardMedia
                            sx={{ height: '20vh' }}
                            image="/retirementplans.jpeg"
                            title="new feature 6"
                        />
                        <CardContent sx={{ pb: 1 }}>
                            <Typography variant="h5" component="div">
                                Retirement Plans
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <ul>
                                    <li>Derive your risk profile</li>
                                    <li>Plan your retirement corpus</li>
                                    <li>Create Retirement Plans using various methodologies</li>
                                </ul>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ComingSoon;