import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LandingHeader from '../../components/landingpage/LandingHeader';
import LandingSectionVideos from '../../components/landingpage/LandingSectionVideos';

const HelpCentre = () => {
    
    const [tabIndex, setTabIndex] = useState(0);
    
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
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
            <LandingHeader sourcePage={'HelpCentre'}/>
            <Box
                sx={{
                    width: '100%',
                    height: '30vh',
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
                    Help Centre
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 3, fontSize: '1rem', fontStyle: 'italic' }}>
                Please browse our help centre for answers to common questions. 
                </Typography>
                <Typography variant="h6" component="div" align="center" sx={{ mt: 0, fontSize: '1rem', fontStyle: 'italic' }}>
                    If you can't find what you're looking for, please&nbsp;
                    <Link underline="hover" color="primary" href="/contactus" sx={{ fontStyle: 'italic', textDecoration: 'underline' }}>
                        send us a message
                    </Link> .
                </Typography>
            </Box>
            <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                centered
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                    '& .MuiTab-root': {
                        backgroundColor: '#e0e0e0',
                        borderRadius: 1,
                        margin: 1,
                        '&.Mui-selected': {
                            // backgroundColor: '#1976d2',
                            backgroundColor: 'purple',
                            color: '#fff',
                        },
                    },
                }}
            >
                <Tab label="FAQs" />
                <Tab label="Product Videos" />
                <Tab label="Blogs/Articles" />
            </Tabs>
            {tabIndex === 0 && (
                <Box
                    sx={{
                        width: '80%',
                        mt: 2,
                        p: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto', // Center the Box
                    }}
                >
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">General Questions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">What is FinWise365?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        FinWise365 is a comprehensive financial planning tool designed to help you manage your assets, liabilities, and cash flows effectively.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I create an account on FinWise365?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        To create an account, click on the "Sign Up" button on the homepage and follow the instructions to register.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I reset my password?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        If you have forgotten your password, click on the "Forgot Password" link on the login page and follow the instructions to reset it.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Account Management</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I update my profile information?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        You can update your profile information by navigating to the "Profile" section in your account settings.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I change my base currency?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        To change your base currency, go to the "Settings" section and select your preferred currency from the dropdown menu.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Financial Planning</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I add a new asset?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        To add a new asset, go to the "Assets" section and click on the "+" button at the bottom right of the screen. Fill in the required details and save.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I track my expenses?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        You can track your expenses by adding them in the "Expenses" section. You can categorize your expenses and view detailed reports.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            {/* <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I set financial goals?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        To set financial goals, navigate to the "Goals" section and click on "Add Goal". Enter your goal details and save.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion> */}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Cash Flow Management</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I generate a cash flow report?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        To generate a cash flow report, go to the "Analyze - Cashflow" Menu Option and select "CashFlow". It will generate the cashflows based on your life expectancy settings.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I simulate different financial scenarios?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        You can simulate different financial scenarios using the "Insights - Simulations" feature. Enter the parameters for the scenario you want to simulate and view the results.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Security and Privacy</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How is my data secured on FinWise365?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        FinWise365 uses industry-standard encryption and security measures to protect your data. For more details, refer to our Privacy Policy.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">Can I export my financial data?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        Yes, you can export your financial data in Excel format by using the Download feature on the top right of each page under the Portfolio section. 
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Support</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I contact customer support?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        If you need assistance, you can contact our customer support team by clicking on the "Contact Us" link in the Help Centre.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">Where can I find tutorials and guides?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        You can find video tutorials and guides/blogs in the "Help Centre" section.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Miscellaneous</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/* <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">How do I delete my account?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        To delete your account, go to the "Settings" section and click on "Delete Account". Please note that this action is irreversible.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion> */}
                            <Accordion sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">What should I do if I encounter a bug or issue?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">
                                        If you encounter a bug or issue, please report it to our support team through the "Contact Us" link in the Help Centre.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            )}
            {tabIndex === 1 && (
                <Box
                    sx={{
                        width: '80%',
                        mt: 2,
                        p: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto', // Center the Box
                    }}
                >
                    <LandingSectionVideos />
                </Box>
            )}
            {tabIndex === 2 && (
                <Box
                    sx={{
                        width: '80%',
                        mt: 2,
                        p: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '0 auto', // Center the Box
                    }}
                >
                   <Typography variant="body1">
                        Coming Soon...
                    </Typography> 
                </Box>
            )}
        </Box>
    );
};

export default HelpCentre;