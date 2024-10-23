import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';

const LandingSectionFeatures = () => {
    return (
        <Box sx={{ padding: 0, width: '100%', bgcolor: '#e0f7fa' }}>
            <Box textAlign="center" sx={{ paddingTop: 2 }}> {/* Center text horizontally */}
                <Typography variant="h4" component="h2" >
                    Why FinWise365?
                </Typography>
                <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                    <Divider sx={{ width: '300px', bgcolor: 'grey.500', height: '2px' }} /> {/* Set a specific width and height for the divider */}
                </Box>
            </Box>
            <Grid container spacing={0}>
                {/* Row 1 */}
                <Grid item xs={12} sm={5} sx={{ height: '250px', flexBasis: '40%', padding: 2 }}> {/* Left Column (Image) */}
                    <Box
                        sx={{
                            width: '100%', // Full width of the parent container
                            height: '100%', // Set a height for the section
                            backgroundImage: 'url(/landingpageassetliability.jpg)', // Reference the image in the public folder
                            backgroundSize: 'cover', // Cover the entire box
                            backgroundPosition: 'center', // Center the image
                            backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                            alignItems: 'center',
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={7} sx={{ flexBasis: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Right Column (Text) */}
                    <Box textAlign="center"> {/* Center text horizontally */}
                        <Typography variant="h5" component="h2">
                            Repository of all Assets & Liabilities
                        </Typography>
                        <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                            <Divider sx={{ width: '400px', bgcolor: 'grey.500', height: '1px' }} /> {/* Set a specific width and height for the divider */}
                        </Box>
                        <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem' }}>
                            No need to look around at multiple spreadsheets and folders. Can be shared with the dependent(s) anytime and is available at a single location for easy reference.
                        </Typography>
                    </Box>
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} sm={7} sx={{ flexBasis: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Right Column (Text) */}
                    <Box textAlign="center"> {/* Center text horizontally */}
                        <Typography variant="h5" component="h2">
                            View of projected cashflows
                        </Typography>
                        <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                            <Divider sx={{ width: '350px', bgcolor: 'grey.500', height: '1px' }} /> {/* Set a specific width and height for the divider */}
                        </Box>
                        <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem' }}>
                            Over the entire life horizon so that you know if/what you are doing will sustain you for your life time. Or do you need to make any adjustments to your income and/or expenditure?
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={5} sx={{ height: '250px', flexBasis: '40%', padding: 2 }}> {/* Left Column (Image) */}
                    <Box
                        sx={{
                            width: '100%', // Full width of the parent container
                            height: '100%', // Set a height for the section
                            backgroundImage: 'url(/landingpagecashflow.jpg)', // Reference the image in the public folder
                            backgroundSize: 'cover', // Cover the entire box
                            backgroundPosition: 'center', // Center the image
                            backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                            alignItems: 'center',
                        }}
                    />
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} sm={5} sx={{ height: '250px', flexBasis: '40%', padding: 2 }}> {/* Left Column (Image) */}
                    <Box
                        sx={{
                            width: '100%', // Full width of the parent container
                            height: '100%', // Set a height for the section
                            backgroundImage: 'url(/landingpagesmartdecision.png)', // Reference the image in the public folder
                            backgroundSize: 'cover', // Cover the entire box
                            backgroundPosition: 'center', // Center the image
                            backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                            alignItems: 'center',
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={7} sx={{ flexBasis: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Right Column (Text) */}
                    <Box textAlign="center"> {/* Center text horizontally */}
                        <Typography variant="h5" component="h2">
                            Enables SMART decision making
                        </Typography>
                        <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                            <Divider sx={{ width: '400px', bgcolor: 'grey.500', height: '1px' }} /> {/* Set a specific width and height for the divider */}
                        </Box>
                        <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem' }}>
                            So that any decision is not based on current-point-in-time view but instead based on how this decision impacts your entire life. 
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LandingSectionFeatures;
