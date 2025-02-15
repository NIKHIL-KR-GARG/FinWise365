import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import Link from '@mui/material/Link'; 
import FacebookIcon from '@mui/icons-material/Facebook'; 
import InstagramIcon from '@mui/icons-material/Instagram'; 
import YouTubeIcon from '@mui/icons-material/YouTube'; 
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const LandingFooter = () => {
    const theme = useTheme(); // Get the theme object
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

    return (
        <Box sx={{ 
                width: '100%', 
                bgcolor: '#0d47a1', 
                pt: 2, 
                px: 0, 
                pb: 0, 
                }}>
            <Grid container spacing={0} direction={isMobile ? 'column' : 'row'}> {/* Adjust direction based on screen size */}
                <Grid item xs={12} sm={5} sx={{ flexBasis: isMobile ? '100%' : '40%', textAlign: 'left', padding: 2 }}> {/* Adjust flexBasis for mobile */}
                    <Typography variant="h5" component="h2" sx={{ color: 'white' }}>
                        About FinWise365
                    </Typography>
                    <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> 
                        <Divider sx={{ width: '200px', bgcolor: 'grey.500', height: '1px' }} /> 
                    </Box>
                    <Typography 
                        variant="body1" 
                        component="p" 
                        textAlign={'left'}
                        sx={{ 
                            fontSize: '1rem', 
                            color: 'white', 
                            fontStyle: 'italic', 
                            width: '90%', 
                        }}
                    >
                    FinWise365 was born out of a passion for financial literacy and a 
                    lack of effective and comprehensive personal finance management tools. 
                    Our goal is to provide a user-friendly, secure, and personalized experience 
                    that helps you set goals, track expenses, master your finances and achieve your dreams.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ flexBasis: isMobile ? '100%' : '25%', textAlign: 'left', padding: 2 }}> {/* Adjust flexBasis for mobile */}
                    <Typography variant="h5" component="h2" sx={{ color: 'white' }}>
                        Help
                    </Typography>
                    <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> 
                        <Divider sx={{ width: '75px', bgcolor: 'grey.500', height: '1px' }} /> 
                    </Box>
                    <Link href="/helpcentre" sx={{ fontSize: '1.1rem', color: 'white', paddingBottom: 2, display: 'block', textDecoration: 'none' }}>
                        FAQs
                    </Link>
                    <Link href="/helpcentre" sx={{ fontSize: '1.1rem', color: 'white', paddingBottom: 2, display: 'block', textDecoration: 'none' }}>
                        Blogs/Articles
                    </Link>
                    <Link href="/helpcentre" sx={{ fontSize: '1.1rem', color: 'white', paddingBottom: 2, display: 'block', textDecoration: 'none' }}>
                        Product Videos
                    </Link>
                    <Link href="/comingsoon" sx={{ fontSize: '1.1rem', color: 'white', paddingBottom: 2, display: 'block', textDecoration: 'none' }}>
                        Coming Soon...
                    </Link>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ flexBasis: isMobile ? '100%' : '25%', textAlign: 'left', padding: 2 }}> {/* Adjust flexBasis for mobile */}
                    <Typography variant="h5" component="h2" sx={{ color: 'white' }}>
                        Our Contact Info:
                    </Typography>
                    <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> 
                        <Divider sx={{ width: '200px', bgcolor: 'grey.500', height: '1px' }} /> 
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton href="mailto:contactus@finwise365.com" sx={{ color: 'white' }}>
                            <EmailIcon />
                        </IconButton>
                        <Link href="mailto:contactus@finwise365.com" sx={{ fontSize: '1.1rem', color: 'white', marginLeft: 1, textDecoration: 'none' }}>
                            contactus@finwise365.com
                        </Link>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ flexBasis: isMobile ? '100%' : '10%', textAlign: 'center', padding: 2 }}> {/* Adjust flexBasis for mobile */}
                    <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
                        Follow Us
                    </Typography>
                    <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> 
                        <Divider sx={{ width: '75px', bgcolor: 'grey.500', height: '1px' }} /> 
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center' }}> {/* Adjust flexDirection for mobile */}
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
            </Grid >
            <Box textAlign="center" sx={{ width: '100%', pb:2 }}>
                <Typography 
                        variant="body1" 
                        component="p" 
                        sx={{ 
                            fontSize: '0.9rem', 
                            color: 'white', 
                            fontStyle: 'italic', 
                        }}
                    >
                        @ Copyright FinWise365.com. All Rights Reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default LandingFooter;