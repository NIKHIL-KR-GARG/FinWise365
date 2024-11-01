import React, { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

const LoginCallback = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();
    const hasCalledApi = useRef(false);

    useEffect(() => {

        const handleUser = async () => {

            if (isLoading) return; // Wait until loading is complete

            if (isAuthenticated && user && !hasCalledApi.current) {
                
                hasCalledApi.current = true; // Set the ref to true to prevent further calls

                try {
                    // Get CSRF token from the meta tag
                    //const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                    // Send a request to your Rails API to create or find the user
                    const response = await axios.post('http://localhost:3000/api/users/create_or_find_user', {
                        email: user.email,
                    }, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                        },
                    });

                    // Handle the response as needed
                    console.log(response.data);
                    // Redirect to the home page or another page after successful login
                    navigate('/home');
                } catch (error) {
                    console.error('Error creating or finding user:', error);
                    // Handle error (e.g., show a message to the user)
                }
            }
        };

        handleUser();

    }, [isAuthenticated, user, isLoading, navigate]);

    return (
        <></>
    );
};

export default LoginCallback;