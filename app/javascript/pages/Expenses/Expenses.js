import React, { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton, Link } from '@mui/material';
//icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import ExpenseHomeList from '../../components/expensespage/home/ExpenseHomeList';
import ExpenseHomeForm from '../../components/expensespage/home/ExpenseHomeForm';

const Expenses = () => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [action, setAction] = useState(''); // State for action
    const [expenseAction, setExpenseAction] = useState(''); // State for action

    const homeListRef = useRef(null);
    const [homeCount, setHomeCount] = useState(0); // State for home count

    useEffect(() => {
        if (homeListRef.current) {
            setHomeCount(homeListRef.current.getHomeCount());
        }
    }, []);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleFormModalOpen = (type) => {
        setAction('Add');
        setExpenseAction(type);
        setFormModalOpen(true);
        setModalOpen(false); // Close the right side modal box
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setExpenseAction('');
        setAction('');
    };

    const handleHomeAdded = (updatedHome, successMsg) => {
        if (homeListRef.current) {
            homeListRef.current.refreshHomeList(updatedHome, successMsg);
            setHomeCount(homeCount + 1);
        }
    };

    const handleHomesFetched = (count) => {
        setHomeCount(count);
    };

    const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace(/ /g, '-');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HomeHeader open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}>
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
                        <Link underline="hover" color="inherit" href="">
                            Portfolio
                        </Link>
                        <Typography color="textPrimary">Expenses</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MoneyOffIcon sx={{ mr: 1 }} />
                                My Expenses
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}As Of Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                            {/* <ExpensesGraph /> */}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <HomeIcon sx={{ mr: 1, color: 'blue' }} />
                                        Home Expenses ({homeCount})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ExpenseHomeList ref={homeListRef} onHomesFetched={handleHomesFetched} />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <ApartmentIcon sx={{ mr: 1, color: 'red' }} />
                                        Property Expenses 
                                        {/* ({propertyCount}) Display property count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <AssetPropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} /> */}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ mr: 1, color: 'teal' }} />
                                        Personal Loans
                                        {/* ({propertyCount}) Display property count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <AssetPropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} /> */}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <CreditCardIcon sx={{ mr: 1, color: 'yellow' }} />
                                        Credit Card Loans
                                        {/* ({propertyCount}) Display property count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <AssetPropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} /> */}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <MiscellaneousServicesIcon sx={{ mr: 1, color: 'green' }} />
                                        Other Expenses
                                        {/* ({propertyCount}) Display property count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <AssetPropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} /> */}
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Fab 
                color="secondary"
                aria-label="add" 
                sx={{ position: 'fixed', bottom: 16, right: 16, width: 70, height: 70 }} 
                onClick={handleModalOpen}
            >
                <AddIcon sx={{ fontSize: 40 }} />
            </Fab>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', mt: '350px', mr: '48px' }}
            >
                <Box sx={{ width: 325, bgcolor: 'purple', p: 2, boxShadow: 24, borderRadius: 4 }}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                        Add New Expense
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Home Expense')}
                        >
                            <HomeIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Home</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Property Expense')}
                        >
                            <ApartmentIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Property</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Personal Loan')}
                        >
                            <PersonIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Personal Loan</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Credit Card Loan')}
                        >
                            <CreditCardIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Credit Card Loan</Typography>
                        </Box>
                        <Box 
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Other Expense')}
                        >
                            <MiscellaneousServicesIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Other Expense</Typography>
                        </Box>
                    </Box>
                </Box>
            </Modal>
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
                <Box sx={{ width: 650, height: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative' }}>
                    {expenseAction === 'Add Home Expense' && (
                        <ExpenseHomeForm home={null} action={action} onClose={handleFormModalClose} refreshHomeList={handleHomeAdded} />
                    )}
                    {/* {expenseAction === 'Add Property Expense' && (
                        <AssetPropertyForm property={null} action={action} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )} */}
                    {/* {expenseAction === 'Add Persoal Loan' && (
                        <AssetPropertyForm property={null} action={action} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )} */}
                    {/* {expenseAction === 'Add Credit Card Loan' && (
                        <AssetPropertyForm property={null} action={action} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )} */}
                    {/* {expenseAction === 'Add Other Expense' && (
                        <AssetPropertyForm property={null} action={action} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )} */}
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

export default Expenses;