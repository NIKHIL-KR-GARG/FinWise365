import * as React from 'react';
import Box from '@mui/material/Box';
import MenuButton from '../common/MenuButton';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const LandingHeader = () => {
  return (
    <Box
      sx={{
        width: '100%', // Full width of the parent container
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: 2,
        px: 0, // Horizontal padding
        pb: 1, // Added padding-bottom for height
        bgcolor: '#0d47a1', // Nice shade of blue
        position: 'fixed', // Fix the header to the top
        top: 0, // Align to the top
        zIndex: 1000, // Ensure it stays above other content
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MenuButton aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <Typography variant="h6" component="span" sx={{ color: 'white' }}>
          FinWise365
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 6 }}>
        <Link href="/home" sx={{ textDecoration: 'none', color: 'white' }}> {/* Change to Link */}
          <Typography variant="body1" sx={{ color: 'white' }}>
            Home
          </Typography>
        </Link>
        <Link href="/about" sx={{ textDecoration: 'none', color: 'white' }}> {/* Change to Link */}
          <Typography variant="body1" sx={{ color: 'white' }}>
            About
          </Typography>
        </Link>
        <Link href="/contact" sx={{ textDecoration: 'none', color: 'white' }}> {/* Change to Link */}
          <Typography variant="body1" sx={{ color: 'white' }}>
            Contact Us
          </Typography>
        </Link>
        <Link href="/login" sx={{ textDecoration: 'none', color: 'white' }}> {/* Change to Link */}
          <Typography variant="body1" sx={{ color: 'white' }}>
            Login
          </Typography>
        </Link>
        <Link href="/signup" sx={{ textDecoration: 'none', color: 'white', marginRight: 4 }}> {/* Change to Link */}
          <Typography variant="body1" sx={{ color: 'white' }}>
            Signup
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}

export default LandingHeader;