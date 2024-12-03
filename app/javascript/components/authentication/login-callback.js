import React, { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
                    console.log('user:', user);
                     // Send a request to your Rails API to create or find the user
                    // const response = await axios.post('http://localhost:3000/api/users/create_or_find_user', {
                        const response = await axios.post('http://www.finwise365.com/api/users/create_or_find_user', {
                        email: user.email,
                    }, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                        },
                    });

                    const { id, first_name, last_name, date_of_birth, base_currency, life_expectancy, 
                        nationality, country_of_residence, is_permanent_resident, 
                        is_display_dummy_data, is_admin } = response.data;
                        
                    localStorage.setItem('currentUserId', id);
                    localStorage.setItem('currentUserFirstName', first_name || '');
                    localStorage.setItem('currentUserLastName', last_name || '');
                    localStorage.setItem('currentUserDateOfBirth', date_of_birth);
                    localStorage.setItem('currentUserEmail', user.email);
                    localStorage.setItem('currentUserBaseCurrency', base_currency);
                    localStorage.setItem('currentUserLifeExpectancy', life_expectancy);
                    localStorage.setItem('currentUserNationality', nationality);
                    localStorage.setItem('currentUserCountryOfResidence', country_of_residence);
                    localStorage.setItem('currentUserIsPermanentResident', is_permanent_resident);
                    localStorage.setItem('currentUserDisplayDummyData', is_display_dummy_data || true);
                    localStorage.setItem('currentUserIsAdmin', is_admin || false);
 
                    // Redirect to the home page after successful login
                    navigate('/home');

                } catch (error) {
                    // Handle error (e.g., show a message to the user)
                    console.error('Error creating or finding user:', error);
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