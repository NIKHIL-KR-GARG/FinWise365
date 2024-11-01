import React from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Link from '@mui/material/Link';

//import Callback from '../../components/authentication/login-callback';

const Home = () => {

    const { logout } = useAuth0();
    const navigate = useNavigate(); // Initialize useNavigate

    const gotocallback = async () => {
        navigate('/logincallback'); // Redirect to the Callback page
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
            <Typography variant="h4" component="h2" >
                HOME PAGE
            </Typography>
            <button id="logoutButton" onClick={() => logout()}>
                Log out
            </button>
            <Link
                component="button" // Change to button for onClick
                onClick={gotocallback}
            >
                <Typography variant="body1">
                    GOTO CALLBACK PAGE
                </Typography>
            </Link>
        </Box>
    );
};

export default Home;