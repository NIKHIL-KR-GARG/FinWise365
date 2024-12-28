import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Snackbar, Alert, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LandingHeader from '../../components/landingpage/LandingHeader';

const ContactUs = () => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [agree, setAgree] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address');
            setSuccessMessage('');
            return;
        }
        if (!agree) {
            setErrorMessage('You must agree to the Privacy Policy and Cookie Policy');
            setSuccessMessage('');
            return;
        }
        try {
            const contactAdmin = {
                name: name,
                company: company,
                email: email,
                message: message
            };

            await axios.post('/api/contact_admins', contactAdmin);

            setSuccessMessage('Message sent successfully');
            setName('');
            setCompany('');
            setEmail('');
            setMessage('');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error sending message');
            setSuccessMessage('');
        }
    };

    return (
        <Box
            sx={{
                width: '100%', // Full width of the parent container
                alignItems: 'center',
                justifyContent: 'center',
                px: 0, // Horizontal padding
            }}
        >
            <LandingHeader sourcePage={'ContactUs'}/>
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
                    Send Us a Message
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 3, fontSize: '1rem', fontStyle: 'italic' }}>
                    We would love to hear from you.
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 0, fontSize: '1rem', fontStyle: 'italic' }}>
                    Please fill out the form below to send us any feedback or questions.
                </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} 
            sx={{ maxWidth: 600, 
                mx: 'auto', 
                mt: -10, 
                p: 3, 
                border: '1px solid #ccc', 
                borderRadius: 2,
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                position: 'relative',
                zIndex: 1,
                }}>
                {/* <Typography variant="h4" gutterBottom>Contact Us</Typography> */}
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    multiline
                    required
                    rows={4}
                    fullWidth
                    margin="normal"
                />
                <FormControlLabel
                    control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />}
                    label="By submitting this, you agree to the Privacy Policy and Cookie Policy"
                />
                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Send Message
                    </Button>
                </Box>
                <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="success"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setSuccessMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setErrorMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
            </Box>
        </Box>
    );
};

export default ContactUs;