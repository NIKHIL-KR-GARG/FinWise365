import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LandingSectionTagline = () => {
  return (
    <Box
      sx={{
        width: '100%', // Full width of the parent container
        height: '400px', // Set a height for the section
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
      }}
    >
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          textAlign: 'center', 
          position: 'absolute', 
          color: '#002200', 
          fontWeight: 'bold', 
          fontFamily: 'Pacifico, cursive', // Apply the funky font
          //textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' // Add text shadow
        }}
      >
       Unlock Your Financial Wisdom, 365 Days a Year!
      </Typography>
    </Box>
  );
}

export default LandingSectionTagline;