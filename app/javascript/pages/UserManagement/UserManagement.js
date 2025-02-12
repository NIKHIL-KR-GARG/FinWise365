import React, { useState, useRef, useEffect } from 'react';
import { Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton } from '@mui/material';
import Link from '@mui/material/Link';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import CloseIconFilled from '@mui/icons-material/Close';
import axios from 'axios';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import UserList from '../../components/usermanagementpage/UserList';
import UserProfile from '../../components/accountsettingspage/userprofile/UserProfile';

const UserManagement = () => {

    const [open, setOpen] = useState(true);
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userListRef = useRef(null);
    const [userCount, setUserCount] = useState(0);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (userListRef.current) {
            setUserCount(userListRef.current.getUserCount());
        }
    }, []);

    // useEffect(() => {
    //     if (userListRef.current) {
    //         userListRef.current.refreshUserList(updatedUser, successMsg);
    //         setUserCount(userCount + 1);
    //     }
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch all the users
                const response = await axios.get(`/api/users`);
                setUsers(response.data);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const handleFormModalOpen = () => {
        setFormModalOpen(true);
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
    };

    const handleUsersFetched = (count) => {
        setUserCount(count);
    };

    const handleUserAdded = (updatedUser, successMsg) => {
        if (userListRef.current) {
            userListRef.current.refreshUserList(updatedUser, successMsg);
            setUserCount(userCount + 1);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HomeHeader open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}> {/* Adjust mt to match header height */}
                <HomeLeftMenu open={open} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        transition: (theme) => theme.transitions.create('margin', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    }}
                >
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                        <Link underline="hover" color="inherit" href="/home">
                            Home
                        </Link>
                        <Typography color="textPrimary">User Management</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 3, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <GroupIcon sx={{ mr: 1 }} />
                                User Management
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ flexGrow: 1, p: 0 }}>
                                <UserList ref={userListRef} onUsersFetched={handleUsersFetched} usersList={users}/>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Fab
                color="secondary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16, width: 70, height: 70 }}
                onClick={handleFormModalOpen}
            >
                <AddIcon sx={{ fontSize: 40 }} />
            </Fab>
            <Modal
                open={formModalOpen}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleFormModalClose();
                    }
                }}
                aria-labelledby="form-modal-title"
                aria-describedby="form-modal-description"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{ width: '90%', maxWidth: 650, height: '90%', maxHeight: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative', overflowY: 'auto' }}>
                    <UserProfile user={null} action={'Add'} onClose={handleFormModalClose} refreshUserList={handleUserAdded} />
                    <IconButton
                        onClick={handleFormModalClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 24,
                            border: '1px solid',
                            borderColor: 'grey.500'
                        }}
                    >
                        <CloseIconFilled />
                    </IconButton>
                </Box>
            </Modal>
        </Box>
    );
};

export default UserManagement;