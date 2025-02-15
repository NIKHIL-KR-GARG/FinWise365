import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const LandingSectionTagline = () => {

  const theme = useTheme(); // Get the theme object
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

  return (
    <Box
      sx={{
        width: '100%', // Full width of the parent container
        height: isMobile ? '300px' : '400px', // Adjust height for mobile
        backgroundImage: 'url(/landingtaglineimage.jpg)', // Reference the image in the public folder
        backgroundSize: 'cover', // Cover the entire box
        backgroundPosition: 'bottom', // Center the image
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', // Position relative for absolute positioning of tagline
        color: 'white', // Text color
        px: 0, // Horizontal padding'
        zIndex: 1, // Ensure it stays behind the text
        paddingTop: isMobile ? '50px' : 0, // Adjust padding top for mobile to account for header
      }}
    >
      <Typography 
        variant={isMobile ? "h5" : "h4"} // Adjust font size for mobile
        component="h2" 
        sx={{ 
          textAlign: 'center', 
          position: 'absolute', 
          top: isMobile ? '50%' : 'auto', // Center text vertically in mobile mode
          color: '#002200', 
          fontWeight: 'bold', 
          fontFamily: 'Pacifico, cursive', // Apply the funky font
        }}
      >
       Unlock Your Financial Wisdom, 365 Days a Year!
      </Typography>
    </Box>
  );
}

export default LandingSectionTagline;