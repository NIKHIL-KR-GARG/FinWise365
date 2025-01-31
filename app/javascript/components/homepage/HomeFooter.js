import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const HomeFooter = () => {
    return (
        <Box
            sx={{
                bgcolor: 'primary.main', // Use the primary color from the theme
                color: 'white',
                py: 1,
                px: 1,
                position: 'fixed',
                bottom: 0,
                width: '100%',
                transition: 'margin-left 0.3s, width 0.3s',
            }}
        >
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item xs={12} sm={6} sx={{ textAlign: 'left', padding: 0, pl: 1 }}>
                    <Typography variant="body1" component="p" sx={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
                        @ Copyright FinWise365.com. All Rights Reserved.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right', padding: 0, pr: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <IconButton href="https://www.facebook.com/profile.php?id=61572269735204" target="_blank" sx={{ color: 'white' }}>
                            <FacebookIcon />
                        </IconButton>
                        <IconButton href="https://www.instagram.com/finwise365/" target="_blank" sx={{ color: 'white' }}>
                            <InstagramIcon />
                        </IconButton>
                        <IconButton href="https://www.youtube.com/@FinWise365" target="_blank" sx={{ color: 'white' }}>
                            <YouTubeIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default HomeFooter;