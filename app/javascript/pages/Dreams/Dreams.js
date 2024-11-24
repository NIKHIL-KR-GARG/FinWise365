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
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { useNavigate } from 'react-router-dom';

import AssetPropertyList from '../../components/assetspage/properties/AssetPropertyList'; 
import AssetPropertyForm from '../../components/assetspage/properties/AssetPropertyForm';
import AssetVehicleList from '../../components/assetspage/vehicles/AssetVehicleList';
import AssetVehicleForm from '../../components/assetspage/vehicles/AssetVehicleForm';
import DreamList from '../../components/dreamspage/DreamList';
import DreamForm from '../../components/dreamspage/DreamForm';
import DreamsGraph from '../../components/dreamspage/DreamsGraph';

const Dreams = () => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false); // State for Form Modal
    const [action, setAction] = useState('Dream'); // State for action
    const [dreamAction, setDreamAction] = useState(''); // State for action
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [futureIncomeDialogOpen, setFutureIncomeDialogOpen] = useState(false); // State for Future Income Dialog
    const navigate = useNavigate();

    const propertyListRef = useRef(null);
    const [propertyCount, setPropertyCount] = useState(0); // State for property count

    const vehicleListRef = useRef(null);
    const [vehicleCount, setVehicleCount] = useState(0); // State for vehicle count

    const [educationCount, setEducationCount] = useState(0); // State for education count
    const [travelCount, setTravelCount] = useState(0); // State for travel count
    const [relocationCount, setRelocationCount] = useState(0); // State for relocation count
    const [otherCount, setOtherCount] = useState(0); // State for other count

    const educationListRef = useRef(null);
    const travelListRef = useRef(null);
    const relocationListRef = useRef(null);
    const otherListRef = useRef(null);

    useEffect(() => {
        if (propertyListRef.current) {
            setPropertyCount(propertyListRef.current.getPropertyCount());
        }
        if (vehicleListRef.current) {
            setVehicleCount(vehicleListRef.current.getVehicleCount());
        }
        if (educationListRef.current) {
            setEducationCount(educationListRef.current.getDreamCount());
        }
        if (travelListRef.current) {
            setTravelCount(travelListRef.current.getDreamCount());
        }
        if (relocationListRef.current) {
            setRelocationCount(relocationListRef.current.getDreamCount());
        }
        if (otherListRef.current) {
            setOtherCount(otherListRef.current.getDreamCount());
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
        setDreamAction(type);
        setFormModalOpen(true);
        setModalOpen(false); // Close the right side modal box
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setDreamAction('');
        setAction('');
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
    const handleEducationAdded = (updatedEducation, successMsg) => {
        if (educationListRef.current) {
            educationListRef.current.refreshDreamList(updatedEducation, successMsg);
            setEducationCount(educationCount + 1);
        }
    };
    const handleTravelAdded = (updatedTravel, successMsg) => {
        if (travelListRef.current) {
            travelListRef.current.refreshDreamList(updatedTravel, successMsg);
            setTravelCount(travelCount + 1);
        }
    };
    const handleRelocationAdded = (updatedRelocation, successMsg) => {
        if (relocationListRef.current) {
            relocationListRef.current.refreshDreamList(updatedRelocation, successMsg);
            setRelocationCount(relocationCount + 1);
        }   
    };
    const handleOtherAdded = (updatedOther, successMsg) => {
        if (otherListRef.current) {
            otherListRef.current.refreshDreamList(updatedOther, successMsg);
            setOtherCount(otherCount + 1);
        }
    };

    const handlePropertiesFetched = (count) => {
        setPropertyCount(count);
    };
    const handleVehiclesFetched = (count) => {
        setVehicleCount(count);
    };
    const handleEducationFetched = (count) => {
        setEducationCount(count);
    };
    const handleTravelFetched = (count) => {
        setTravelCount(count);
    };
    const handleRelocationFetched = (count) => {
        setRelocationCount(count);
    };
    const handleOtherFetched = (count) => {
        setOtherCount(count);
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

    const handleFutureIncomeClick = () => {
        setFutureIncomeDialogOpen(true);
    };

    const handleFutureIncomeDialogClose = (confirmed) => {
        setFutureIncomeDialogOpen(false);
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
                            <DreamsGraph />
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
                                        Education ({educationCount}) {/* Display education count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DreamList ref={educationListRef} onDreamsFetched={handleEducationFetched} dreamType={'Education'}/>
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
                                        Travel ({travelCount}) {/* Display travel count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DreamList ref={travelListRef} onDreamsFetched={handleTravelFetched} dreamType={'Travel'} />
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
                                        Relocation ({relocationCount}) {/* Display relocation count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DreamList ref={relocationListRef} onDreamsFetched={handleRelocationFetched} dreamType={'Relocation'}/>
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
                                        Other Dreams ({otherCount}) {/* Display other dreams count */}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DreamList ref={otherListRef} onDreamsFetched={handleOtherFetched} dreamType={'Other'}/>
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
                <Box sx={{ width: 350, bgcolor: 'purple', p: 2, boxShadow: 24, borderRadius: 4 }}>
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
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, cursor: 'pointer' }}
                            onClick={() => handleFutureIncomeClick()}
                        >
                            <AttachMoneyOutlinedIcon sx={{ color: 'white' }} />
                            <Typography sx={{ color: 'white', fontSize: 12 }}>Future Income</Typography>
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
                <Box sx={{ width: '90%', maxWidth: 650, height: '90%', maxHeight: 600, bgcolor: 'background.paper', p: 0, boxShadow: 24, borderRadius: 4, position: 'relative', overflowY: 'auto' }}>
                    {dreamAction === 'Add Property' && (
                        <AssetPropertyForm property={null} action={'Dream'} onClose={handleFormModalClose} refreshPropertyList={handlePropertyAdded} />
                    )}
                    {dreamAction === 'Add Vehicle' && (
                        <AssetVehicleForm vehicle={null} action={'Dream'} onClose={handleFormModalClose} refreshVehicleList={handleVehicleAdded} />
                    )}
                    {dreamAction === 'Add Education' && (
                        <DreamForm dream={null} action={action} onClose={handleFormModalClose} refreshDreamList={handleEducationAdded} dreamType={'Education'} />
                    )}
                    {dreamAction === 'Add Travel' && (
                        <DreamForm dream={null} action={action} onClose={handleFormModalClose} refreshDreamList={handleTravelAdded} dreamType={'Travel'}/>
                    )}
                    {dreamAction === 'Add Relocation' && (
                        <DreamForm dream={null} action={action} onClose={handleFormModalClose} refreshDreamList={handleRelocationAdded} dreamType={'Relocation'}/>
                    )}
                    {dreamAction === 'Add Other Dream' && (
                        <DreamForm dream={null} action={action} onClose={handleFormModalClose} refreshDreamList={handleOtherAdded} dreamType={'Other'}/>
                    )}
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
            <Dialog
                open={futureIncomeDialogOpen}
                onClose={() => handleFutureIncomeDialogClose(false)}
                aria-labelledby="future-income-dialog-title"
                aria-describedby="future-income-dialog-description"
            >
                <DialogTitle id="future-income-dialog-title">Future Income</DialogTitle>
                <DialogContent>
                    <DialogContentText id="future-income-dialog-description">
                        Future income can be added from Assets (Income) section. Do you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleFutureIncomeDialogClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleFutureIncomeDialogClose(true)} color="primary" autoFocus>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dreams;