import React from 'react';
import { Box, Typography, Popover, Avatar, Divider, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InboxIcon from '@mui/icons-material/Inbox';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const HomeUserMenuModal = ({ anchorEl, handleClosePopover, user }) => {
    const open = Boolean(anchorEl);
    const id = open ? 'user-settings-popover' : undefined;

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return 'Good Morning';
        } else if (currentHour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            sx={{ borderRadius: 4 }}
        >
            <Box sx={{ p: 3, width: 350 }}>
                <Typography id="user-settings-popover-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {`${getGreeting()}, ${user.name}`}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Avatar src={user.avatar} alt={user.name} sx={{ mr: 2 }} />
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {user.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user.email}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="My Profile" secondary="Account Settings" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="My Inbox" secondary="Messages & Emails"/>
                    </ListItem>
                </List>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Enjoying FinWise365?</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Upgrade now to keep a control on your finances 365 days a year!
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<CelebrationIcon />}
                        sx={{ mt: 2, fontSize: '0.875rem', bgcolor: 'purple', '&:hover': { bgcolor: '#D1C4E9', color: 'black' } }} // Light purple hover color
                    >
                        Subscribe Now
                    </Button>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ExitToAppIcon />}
                    sx={{ mt: 1, width: '100%' }}
                >
                    Logout
                </Button>
            </Box>
        </Popover>
    );
};

export default HomeUserMenuModal;