import React, { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
//icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CloseIconFilled from '@mui/icons-material/Close'; // Import filled version of CloseIcon
import HomeIcon from '@mui/icons-material/Home';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SchoolIcon from '@mui/icons-material/School';
import FlightIcon from '@mui/icons-material/Flight';
import MovingIcon from '@mui/icons-material/Moving';
import SellIcon from '@mui/icons-material/Sell';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { useNavigate } from 'react-router-dom';

import AssetPropertyList from '../../components/assetspage/properties/AssetPropertyList'; 
import AssetPropertyForm from '../../components/assetspage/properties/AssetPropertyForm';
import AssetVehicleList from '../../components/assetspage/vehicles/AssetVehicleList';
import AssetVehicleForm from '../../components/assetspage/vehicles/AssetVehicleForm';

const Dreams = () => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [action, setAction] = useState('Dream'); // State for action
    const [dreamAction, setDreamAction] = useState(''); // State for action
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const navigate = useNavigate();

    const propertyListRef = useRef(null);
    const [propertyCount, setPropertyCount] = useState(0); // State for property count

    const vehicleListRef = useRef(null);
    const [vehicleCount, setVehicleCount] = useState(0); // State for vehicle count

    useEffect(() => {
        if (propertyListRef.current) {
            setPropertyCount(propertyListRef.current.getPropertyCount());
        }
        if (vehicleListRef.current) {
            setVehicleCount(vehicleListRef.current.getVehicleCount());
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
        setAction('Dream');
        setDreamAction(type);
        setFormModalOpen(true);
        setModalOpen(false); // Close the right side modal box
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setDreamAction('');
        setAction('Dream');
    };

    const handlePropertyAdded = (updatedProperty, successMsg) => {
        if (propertyListRef.current) {
            propertyListRef.current.refreshPropertyList(updatedProperty, successMsg);
            setPropertyCount(propertyCount + 1);
        }
    };
    const handleVehicleAdded = (updatedVehicle, successMsg) => {
        if (vehicleListRef.current) {
            vehicleListRef.current.refreshVehicleList(updatedVehicle, successMsg);
            setVehicleCount(vehicleCount + 1);
        }
    };

    const handlePropertiesFetched = (count) => {
        setPropertyCount(count);
    };
    const handleVehiclesFetched = (count) => {
        setVehicleCount(count);
    };
    
    const handleSellPropertyClick = () => {
        setConfirmDialogOpen(true);
    };

    const handleSellVehicleClick = () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmDialogClose = (confirmed) => {
        setConfirmDialogOpen(false);
        if (confirmed) {
            navigate('/assets');
        }
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
                        <Typography color="textPrimary">Dreams</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <StarIcon sx={{ mr: 1 }} />
                                My Dreams
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}As Of Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'center' }}>
                            {/* <DreamsGraph /> */}
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
                                        Properties ({propertyCount}) {/* Display property count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetPropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} listAction={action}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <DirectionsCarIcon sx={{ mr: 1, color: 'red' }} />
                                        Vehicles ({vehicleCount}) {/* Display vehicle count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetVehicleList ref={vehicleListRef} onVehiclesFetched={handleVehiclesFetched} listAction={action}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <SchoolIcon sx={{ mr: 1, color: 'yellow' }} />
                                        Education
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <ExpenseCreditCardDebtList ref={creditCardDebtListRef} onCreditCardDebtsFetched={handleCreditCardDebtsFetched} /> */}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <FlightIcon sx={{ mr: 1, color: 'teal' }} />
                                        Travel
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <ExpensePersonalLoanList ref={personalLoanListRef} onPersonalLoansFetched={handlePersonalLoansFetched} /> */}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ width: '100%', mb: 2, minHeight: 70 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                        <MovingIcon sx={{ mr: 1, color: 'teal' }} />
                                        Relocation
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <ExpensePersonalLoanList ref={personalLoanListRef} onPersonalLoansFetched={handlePersonalLoansFetched} /> */}
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
                                        {/* Other Expenses ({otherCount}) */}
                                        Others
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* <ExpenseOtherList ref={otherListRef} onOthersFetched={handleOthersFetched} /> */}
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
                        Add New Dream
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Property')}
                        >
                            <HomeIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Buy Property</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={handleSellPropertyClick}
                        >
                            <SellIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Sell Property</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Vehicle')}
                        >
                            <DirectionsCarIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Buy Vehicle</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={handleSellVehicleClick}
                        >
                            <SellIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Sell Vehicle</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Education')}
                        >
                            <SchoolIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Education</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Travel')}
                        >
                            <FlightIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Travel</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Relocation')}
                        >
                            <MovingIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Relocation</Typography>
                        </Box>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFormModalOpen('Add Other Dream')}
                        >
                            <MiscellaneousServicesIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Other Dream</Typography>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Dialog
                open={confirmDialogOpen}
                onClose={() => handleConfirmDialogClose(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Existing property or vehicle sale values can be updated from the Property or Vehicle assets. Do you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmDialogClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleConfirmDialogClose(true)} color="primary" autoFocus>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
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
                    {dreamAction === 'Add Property' && (
                        <AssetPropertyForm property={null} action={action} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )}
                    {dreamAction === 'Add Vehicle' && (
                        <AssetVehicleForm vehicle={null} action={action} onClose={handleFormModalClose} refreshVehicleList={handleVehicleAdded} />
                    )}
                    {/* {expenseAction === 'Add Property' && (
                        <ExpenseHomeForm home={null} action={action} onClose={handleFormModalClose} refreshHomeList={handleHomeAdded} />
                    )}
                    {expenseAction === 'Add Vehicle' && (
                        <ExpensePropertyForm property={null} action={action} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )}
                    {expenseAction === 'Add Education' && (
                        <ExpenseCreditCardDebtForm creditcarddebt={null} action={action} onClose={handleFormModalClose} refreshCreditCardDebtList={handleCreditCardDebtAdded} />
                    )}
                    {expenseAction === 'Add Travel' && (
                        <ExpensePersonalLoanForm personalloan={null} action={action} onClose={handleFormModalClose} refreshPersonalLoanList={handlePersonalLoanAdded} />
                    )}
                    {expenseAction === 'Add Relocation' && (
                        <ExpensePersonalLoanForm personalloan={null} action={action} onClose={handleFormModalClose} refreshPersonalLoanList={handlePersonalLoanAdded} />
                    )}
                    {expenseAction === 'Add Other Dream' && (
                        <ExpenseOtherForm other={null} action={action} onClose={handleFormModalClose} refreshOtherList={handleOtherAdded} />
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

export default Dreams;