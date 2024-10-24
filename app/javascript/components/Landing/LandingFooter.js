import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import Link from '@mui/material/Link'; 
import FacebookIcon from '@mui/icons-material/Facebook'; // Import Facebook icon
import InstagramIcon from '@mui/icons-material/Instagram'; // Import Instagram icon
import YouTubeIcon from '@mui/icons-material/YouTube'; // Import YouTube icon
//import TikTokIcon from '@mui/icons-material/TikTok'; // Import TikTok icon

const LandingFooter = () => {
    return (
        <Box sx={{ 
                width: '100%', 
                bgcolor: '#0d47a1', // Dark shade of blue
                pt: 2, // Top padding
                px: 0, // Horizontal padding
                pb: 0, // Added padding-bottom for height
                }}>
            <Grid container spacing={0}>
                <Grid item xs={12} sm={5} sx={{ flexBasis: '40%', textAlign: 'left', padding: 2 }}> {/* Left Column (Text) */}
                    <Typography variant="h5" component="h2" sx={{ color: 'white' }}>
                        About FinWise365
                    </Typography>
                    <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                        <Divider sx={{ width: '200px', bgcolor: 'grey.500', height: '1px' }} /> {/* Set a specific width and height for the divider */}
                    </Box>
                    <Typography 
                        variant="body1" 
                        component="p" 
                        textAlign={'left'}
                        sx={{ 
                            fontSize: '0.9rem', 
                            color: 'white', 
                            fontStyle: 'italic', // Make the text italic
                            width: '90%', // Set the width to 80%
                            //margin: '0 auto' // Center the text horizontally
                        }}
                    >
                    FinWise365 was born out of a passion for financial literacy and a 
                    lack of effecttive and comprehensive personal finance management tools. 
                    Our goal is to provide a user-friendly, secure, and personalized experience 
                    that helps you set goals, track expenses, master your finances and achieve your dreams.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ flexBasis: '25%', textAlign: 'left', padding: 2 }}> {/* Right Column (Help) */}
                    <Typography variant="h5" component="h2" sx={{ color: 'white' }}>
                        Help
                    </Typography>
                    <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                        <Divider sx={{ width: '75px', bgcolor: 'grey.500', height: '1px' }} /> {/* Set a specific width and height for the divider */}
                    </Box>
                    <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem', color: 'white', paddingBottom:2 }}>
                        Blogs/Articles
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem', color: 'white', paddingBottom:2 }}>
                        Product Videos
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ fontSize: '1.1rem', color: 'white', paddingBottom:2 }}>
                        Change Log
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ flexBasis: '25%', textAlign: 'left', padding: 2 }}> {/* Right Column (Contact Info) */}
                    <Typography variant="h5" component="h2" sx={{ color: 'white' }}>
                        Our Contact Info:
                    </Typography>
                    <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                        <Divider sx={{ width: '200px', bgcolor: 'grey.500', height: '1px' }} /> {/* Set a specific width and height for the divider */}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <IconButton href="https://wa.me/1234567890" target="_blank" sx={{ color: 'white' }}>
                            <WhatsAppIcon />
                        </IconButton>
                        <Link href="https://wa.me/1234567890" target="_blank" sx={{ fontSize: '1.1rem', color: 'white', marginLeft: 1, textDecoration: 'none' }}>
                            +1 234 567 890
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <IconButton href="tel:+1234567890" sx={{ color: 'white' }}>
                            <PhoneIcon />
                        </IconButton>
                        <Link href="tel:+1234567890" sx={{ fontSize: '1.1rem', color: 'white', marginLeft: 1, textDecoration: 'none' }}>
                            +1 234 567 890
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton href="mailto:info@finwise365.com" sx={{ color: 'white' }}>
                            <EmailIcon />
                        </IconButton>
                        <Link href="mailto:info@finwise365.com" sx={{ fontSize: '1.1rem', color: 'white', marginLeft: 1, textDecoration: 'none' }}>
                            info@finwise365.com
                        </Link>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ flexBasis: '10%', textAlign: 'left', padding: 2 }}> {/* New Column (Social Media) */}
                    <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
                        Follow Us
                    </Typography>
                    <Box sx={{ display: 'inline-block', width: 'auto', margin: '16px 0' }}> {/* Center the divider */}
                        <Divider sx={{ width: '75px', bgcolor: 'grey.500', height: '1px' }} /> {/* Set a specific width and height for the divider */}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <IconButton href="https://www.facebook.com" target="_blank" sx={{ color: 'white' }}>
                            <FacebookIcon />
                        </IconButton>
                        <IconButton href="https://www.instagram.com" target="_blank" sx={{ color: 'white' }}>
                            <InstagramIcon />
                        </IconButton>
                        <IconButton href="https://www.youtube.com" target="_blank" sx={{ color: 'white' }}>
                            <YouTubeIcon />
                        </IconButton>
                        {/*
                        <IconButton href="https://www.tiktok.com" target="_blank" sx={{ color: 'white' }}>
                            <TikTokIcon />
                        </IconButton>
                        */}
                    </Box>
                </Grid>
            </Grid >
            <Box textAlign="center" sx={{ width: '100%', pb:2 }}>
                <Typography 
                        variant="body1" 
                        component="p" 
                        sx={{ 
                            fontSize: '0.8rem', 
                            color: 'white', 
                            fontStyle: 'italic', // Make the text italic
                        }}
                    >
                        @ Copyright nikhil.garg@finwise365.com. All Rights Reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default LandingFooter;