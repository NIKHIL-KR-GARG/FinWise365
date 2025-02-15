import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const LandingSectionFeatures = () => {

    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    return (
        <Box sx={{ padding: isMobile ? 2 : 0, width: '100%', bgcolor: '#e0f7fa' }}>
            <Box textAlign="center" sx={{ paddingTop: isMobile ? 2 : 4 }}> {/* Center text horizontally */}
                <Typography variant={isMobile ? "h5" : "h4"} component="h2">
                    Why FinWise365?
                </Typography>
                <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                    <Divider sx={{ width: isMobile ? '200px' : '300px', bgcolor: 'grey.500', height: '2px' }} /> {/* Set a specific width and height for the divider */}
                </Box>
            </Box>
            <Grid container spacing={isMobile ? 2 : 0}>
                {/* Row 1 */}
                <Grid item size={12}>
                    <Grid container>
                        <Grid item size={5} sx={{ height: isMobile ? '200px' : '250px', flexBasis: '40%', padding: 0 }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: 'url(/landingpageassetliability.jpg)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    alignItems: 'center',
                                }}
                            />
                        </Grid>
                        <Grid item size={7} sx={{ flexBasis: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '0 8px' : 0, overflow: 'hidden' }}>
                            <Box textAlign="center" sx={{ width: '100%' }}>
                                <Typography variant={isMobile ? "h6" : "h5"} component="h2">
                                    Repository of all Assets, Liabilities & Goals
                                </Typography>
                                <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}>
                                    <Divider sx={{ width: isMobile ? '250px' : '400px', bgcolor: 'grey.500', height: '1px' }} />
                                </Box>
                                <Typography variant="body1" component="p" sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
                                    Achieve your financial goals with ease and confidence. Never lose sight of your financial goals even with all the distractions around you.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Row 2 */}
                <Grid item size={12}>
                    <Grid container>
                        <Grid item size={7} sx={{ flexBasis: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                            <Box textAlign="center" sx={{ width: '100%' }}>
                                <Typography variant={isMobile ? "h6" : "h5"} component="h2">
                                    What Matters to You (and How to Get There)
                                </Typography>
                                <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}>
                                    <Divider sx={{ width: isMobile ? '250px' : '350px', bgcolor: 'grey.500', height: '1px' }} />
                                </Box>
                                <Typography variant="body1" component="p" sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
                                    Balance both your emotional desires (what you want) and practical needs (what you need). Focus on growing your savings, planning for retirement, budgeting for your home and optimise your assets, income and expenses so you can reach those goals
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item size={5} sx={{ height: isMobile ? '200px' : '250px', flexBasis: '40%', padding: 2 }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: 'url(/landingpagecashflow.jpg)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    alignItems: 'center',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Row 3 */}
                <Grid item size={12}>
                    <Grid container>
                        <Grid item size={5} sx={{ height: isMobile ? '200px' : '250px', flexBasis: '40%', padding: 0 }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: 'url(/landingpagesmartdecision.png)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    alignItems: 'center',
                                }}
                            />
                        </Grid>
                        <Grid item size={7} sx={{ flexBasis: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '0 8px' : 0, overflow: 'hidden' }}>
                            <Box textAlign="center" sx={{ width: '100%' }}>
                                <Typography variant={isMobile ? "h6" : "h5"} component="h2">
                                    SMART decision making
                                </Typography>
                                <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}>
                                    <Divider sx={{ width: isMobile ? '250px' : '400px', bgcolor: 'grey.500', height: '1px' }} />
                                </Box>
                                <Typography variant="body1" component="p" sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
                                    Have the right tools and resources to make the right decisions not based on current-point-in-time view but how it impacts your future.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Row 4 */}
                <Grid item size={12}>
                    <Grid container>
                        <Grid item size={7} sx={{ flexBasis: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                            <Box textAlign="center" sx={{ width: '100%' }}>
                                <Typography variant={isMobile ? "h6" : "h5"} component="h2">
                                    Be financially ready for life's uncertainties/opportunities & plan your legacy
                                </Typography>
                                <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}>
                                    <Divider sx={{ width: isMobile ? '250px' : '350px', bgcolor: 'grey.500', height: '1px' }} />
                                </Box>
                                <Typography variant="body1" component="p" sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
                                    Plan for your home, education, wedding, vacation, retirement, and more. Get insights if you can retire by a certain age & if you will have enough to meet your needs.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item size={5} sx={{ height: isMobile ? '200px' : '250px', flexBasis: '40%', padding: 2 }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: 'url(/financialfreedom.jpeg)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    alignItems: 'center',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LandingSectionFeatures;
