import * as React from 'react';
import Box from '@mui/material/Box';
//import MenuButton from '../common/MenuButton';
//import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
//import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { useAuth0 } from "@auth0/auth0-react";

const LandingHeader = () => {

  const { loginWithRedirect } = useAuth0(); // useAuth0 hook destructured
  
  const handleLogin = async () => {
    await loginWithRedirect({});
  };

  const handleSignUp = async () => {
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <Box
      sx={{
        width: '100%', // Full width of the parent container
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: 0.5,
        px: 0, // Horizontal padding
        pb: 0.5, // Added padding-bottom for height
        bgcolor: '#0d47a1', // Nice shade of blue
        position: 'fixed', // Fix the header to the top
        top: 0, // Align to the top
        zIndex: 1000, // Ensure it stays above other content
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton edge="end" color="inherit" aria-label="menu">
          <img src="/SmartOwlLogo.png" alt="Smart Owl" style={{ width: 36, height: 36 }} />
        </IconButton>
        <Typography variant="h6" component="span" sx={{ color: 'white' }}>
          FinWise365
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 6 }}>
        <Link href="/home" sx={{ textDecoration: 'none', color: 'white' }}>
          <Typography variant="body1" sx={{ color: 'white' }}>
            Home
          </Typography>
        </Link>
        <Link href="/about" sx={{ textDecoration: 'none', color: 'white' }}>
          <Typography variant="body1" sx={{ color: 'white' }}>
            About
          </Typography>
        </Link>
        <Link href="/contact" sx={{ textDecoration: 'none', color: 'white' }}>
          <Typography variant="body1" sx={{ color: 'white' }}>
            Contact Us
          </Typography>
        </Link>
        <Link 
          component="button" // Change to button for onClick
          onClick={handleLogin} // Call loginWithRedirect on click
          sx={{ textDecoration: 'none', color: 'white' }}
        >
          <Typography variant="body1" sx={{ color: 'white' }}>
            Login
          </Typography>
        </Link>
        <Link 
          component="button" // Change to button for onClick
          onClick={handleSignUp}
          sx={{ textDecoration: 'none', color: 'white', marginRight: 4 }}>
          <Typography variant="body1" sx={{ color: 'white' }}>
            Signup
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}

export default LandingHeader;