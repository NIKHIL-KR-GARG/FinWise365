import React, { useState } from 'react';
import { Drawer, Divider, List, ListItem, ListItemText, Collapse, Box, Typography, Button, ListItemIcon, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventIcon from '@mui/icons-material/Event';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import HomeIcon from '@mui/icons-material/Home';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { useAuth0 } from "@auth0/auth0-react";

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const HomeLeftMenu = ({ open, handleDrawerToggle }) => {
    
    const [portfolioOpen, setPortfolioOpen] = useState(false);
    const [analyzeOpen, setAnalyzeOpen] = useState(false);
    const [planOpen, setPlanOpen] = useState(false);

    const { logout } = useAuth0();

    const handlePortfolioClick = () => {
        setPortfolioOpen(!portfolioOpen);
    };

    const handleAnalyzeClick = () => {
        setAnalyzeOpen(!analyzeOpen);
    };

    const handlePlanClick = () => {
        setPlanOpen(!planOpen);
    };

    const currentUserFirstName = localStorage.getItem('currentUserFirstName');
    const currentUserLastName = localStorage.getItem('currentUserLastName');

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: open ? drawerWidth : collapsedDrawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? drawerWidth : collapsedDrawerWidth,
                    boxSizing: 'border-box',
                    position: 'fixed',
                    top: '64px', // Adjust this value based on the height of your AppBar
                    height: 'calc(100vh - 64px)', // Adjust this value based on the height of your AppBar
                    overflowY: 'auto', // Make the drawer content scrollable
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    paddingRight: open ? '17px' : '0px', // Add extra width for the vertical scrollbar
                },
            }}
            open={open}
        >   
            <Box sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', p:2 }}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p:1, bgcolor: '#fff9e6', borderRadius: 3 }}>
                    <Avatar src={'/path/to/avatar.jpg'} alt={currentUserFirstName} sx={{ mr: 1 }} />
                    {open && (
                    <Typography variant="body1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                        {currentUserFirstName} {currentUserLastName}
                    </Typography>
                    )}
                </Box>
            </Box>
            <Divider />

            <List sx={{ padding: 0 }}>
                <ListItem button component={Link} to="/home" sx={{ paddingY: 1, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                    <ListItemIcon>
                        <HomeIcon fontSize="small" />
                    </ListItemIcon>
                    {open && <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold', ml: -3 }}>Home</Typography>} />}
                </ListItem>
                <ListItem button onClick={handlePortfolioClick} sx={{ paddingY: 1, '&:hover': { bgcolor: '#e0f7fa' } }}>
                    <ListItemIcon>
                        <PieChartIcon fontSize="small" />
                    </ListItemIcon>
                    {open && <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold', ml: -3 }}>Portfolio</Typography>} />}
                    {portfolioOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={portfolioOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem component={Link} to="/incomes" button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <AttachMoneyOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Income</Typography>} />}
                        </ListItem>
                        <ListItem component={Link} to="/expenses" button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <MoneyOffIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Expenses/Debt</Typography>} />}
                        </ListItem>
                        <ListItem component={Link} to="/assets" button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <AccountBalanceIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Assets</Typography>} />}
                        </ListItem>
                        <ListItem component={Link} to="/dreams" button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <StarIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Dreams</Typography>} />}
                        </ListItem>
                        {/* <ListItem button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <SecurityIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Insurance</Typography>} />}
                        </ListItem> */}
                    </List>
                </Collapse>
                <ListItem button onClick={handleAnalyzeClick} sx={{ paddingY: 1, '&:hover': { bgcolor: '#e0f7fa' } }}>
                    <ListItemIcon>
                        <BarChartIcon fontSize="small" />
                    </ListItemIcon>
                    {open && <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold', ml: -3 }}>Analyze</Typography>} />}
                    {analyzeOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={analyzeOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem component={Link} to="/cashflows" button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <AttachMoneyIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Cashflow</Typography>} />}
                        </ListItem>
                        <ListItem component={Link} to="/cashflowcomparison" button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <TrendingUpIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Cashflow Comparison</Typography>} />}
                        </ListItem>
                        {/* <ListItem button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <TrendingUpIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Simulate</Typography>} />}
                        </ListItem> */}
                    </List>
                </Collapse>
                {/* <ListItem button onClick={handlePlanClick} sx={{ paddingY: 1, '&:hover': { bgcolor: '#e0f7fa' } }}>
                    <ListItemIcon>
                        <TimelineIcon fontSize="small" />
                    </ListItemIcon>
                    {open && <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold', ml: -3 }}>Plan</Typography>} />}
                    {planOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={planOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <AssessmentIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Investment Profile</Typography>} />}
                        </ListItem>
                        <ListItem button sx={{ pl: 4, paddingY: 0.5, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                            <ListItemIcon>
                                <EventIcon fontSize="small" />
                            </ListItemIcon>
                            {open && <ListItemText primary={<Typography variant="body2" sx={{ ml: -3 }}>Retirement Plan</Typography>} />}
                        </ListItem>
                    </List>
                </Collapse> */}
                {open && (
                    <Box sx={{ m: 2, p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper', width: `calc(${drawerWidth}px - 38px)` }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Enjoying FinWise365?</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Upgrade now to keep a control on your finances 365 days a year!
                        </Typography>
                        <Button
                            variant="contained"
                            disabled
                            startIcon={<CelebrationIcon />}
                            sx={{ mt: 2, fontSize: '0.75rem', bgcolor: 'purple', '&:hover':{ bgcolor: '#D1C4E9', color: 'black' } }} 
                        >
                            Subscribe Now
                        </Button>
                    </Box>
                )}
                <Divider />
                <ListItem button sx={{ paddingY: 1, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                    <ListItemIcon>
                        <HelpOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    {open && <ListItemText primary={<Typography variant="body1" sx={{ ml: -3 }}>Help Centre</Typography>} />}
                </ListItem>
                <ListItem button sx={{ paddingY: 1, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }}>
                    <ListItemIcon>
                        <ContactMailIcon fontSize="small" />
                    </ListItemIcon>
                    {open && <ListItemText primary={<Typography variant="body1" sx={{ ml: -3 }}>Contact Us</Typography>} />}
                </ListItem>
                <ListItem button sx={{ paddingY: 1, '&:hover': { bgcolor: '#e0f7fa', cursor: 'pointer' } }} onClick={() => logout()}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    {open && <ListItemText primary={<Typography variant="body1" sx={{ ml: -3 }}>Logout</Typography>} />}
                </ListItem>
            </List>
        </Drawer>
    );
};

export default HomeLeftMenu;