import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Accordion, AccordionSummary, AccordionDetails, Box, Breadcrumbs, Typography, Divider, Fab, Modal, IconButton, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
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
import { ExchangeRate } from '../../components/common/DefaultValues';
import FormatCurrency from '../../components/common/FormatCurrency';

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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [properties, setProperties] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [education, setEducation] = useState([]);
    const [travel, setTravel] = useState([]);
    const [relocation, setRelocation] = useState([]);
    const [other, setOther] = useState([]);
    const [dreamsList, setDreamsList] = useState([]);

    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propertiesResponse, vehiclesResponse, dreamsResponse] = await Promise.all([
                    axios.get(`/api/asset_properties?user_id=${currentUserId}`),
                    axios.get(`/api/asset_vehicles?user_id=${currentUserId}`),
                    axios.get(`/api/dreams?user_id=${currentUserId}`)
                ]);

                // filter properties where purchase_date is in the future
                const propertiesList = propertiesResponse.data.filter(property => new Date(property.purchase_date) >= new Date());
                // filter vehicles where purchase_date is in the future
                const vehiclesList = vehiclesResponse.data.filter(vehicle => new Date(vehicle.purchase_date) >= new Date());
                // filter dreams where dream_type = 'Education' or 'Travel' or 'Relocation' or 'Other'
                const educationList = dreamsResponse.data.filter(dream => dream.dream_type === 'Education');
                const travelList = dreamsResponse.data.filter(dream => dream.dream_type === 'Travel');
                const relocationList = dreamsResponse.data.filter(dream => dream.dream_type === 'Relocation');
                const otherList = dreamsResponse.data.filter(dream => dream.dream_type === 'Other');

                // set state for all the lists
                setProperties(propertiesResponse.data);
                setVehicles(vehiclesResponse.data);
                setEducation(educationList);
                setTravel(travelList);
                setRelocation(relocationList);
                setOther(otherList);

                // starting the current year add rows to the dreamsList array for the next 50 years
                const year = new Date().getFullYear();
                const dreamsList = [];
                for (let i = year; i <= (year + 50); i++) {
                    dreamsList.push({
                        year: i,
                        Property: 0,
                        Vehicle: 0,
                        Education: 0,
                        Travel: 0,
                        Relocation: 0,
                        Other: 0,
                        total_value: 0
                    });
                }

                let maxYear = new Date().getFullYear();

                // loop though the properties and add the value to the corresponding year
                propertiesList.forEach(property => {
                    const purchaseYear = new Date(property.purchase_date).getFullYear();
                    const purchaseValue = parseFloat(property.purchase_price);
                    const stampDuty = parseFloat(property.stamp_duty);
                    const otherFees = parseFloat(property.other_fees);
                    const totalCost = purchaseValue + stampDuty + otherFees;
                    const exchangeRate = ExchangeRate.find(rate => rate.from === property.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(totalCost * conversionRate);
                    // find the corresponding row in the dreamsList array where year = purchaseYear and add the value to the property column
                    dreamsList.find(dream => dream.year === purchaseYear).Property += convertedValue;
                    if (purchaseYear > maxYear) maxYear = purchaseYear;
                });

                // loop though the vehicles and add the value to the corresponding year
                vehiclesList.forEach(vehicle => {
                    const purchaseYear = new Date(vehicle.purchase_date).getFullYear();
                    const purchaseValue = parseFloat(vehicle.purchase_price);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === vehicle.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(purchaseValue * conversionRate);
                    // find the corresponding row in the dreamsList array where year = purchaseYear and add the value to the vehicle column
                    dreamsList.find(dream => dream.year === purchaseYear).Vehicle += convertedValue;
                    if (purchaseYear > maxYear) maxYear = purchaseYear;
                });

                // loop though the education and add the value to the corresponding year
                educationList.forEach(education => {
                    const educationYear = new Date(education.dream_date).getFullYear();
                    const educationValue = parseFloat(education.amount);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === education.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(educationValue) * parseFloat(conversionRate);
                    if (education.end_date) {
                        const educationEndYear = new Date(education.end_date).getFullYear();
                        for (let i = educationYear; i <= educationEndYear; i++) {
                            // find the corresponding row in the dreamsList array where year = educationYear and add the value to the education column
                            dreamsList.find(dream => dream.year === i).Education += convertedValue;
                        }
                        if (educationEndYear > maxYear) maxYear = educationEndYear;
                    }
                    else {
                        // find the corresponding row in the dreamsList array where year = educationYear and add the value to the education column
                        dreamsList.find(dream => dream.year === educationYear).Education += convertedValue;
                        if (educationYear > maxYear) maxYear = educationYear;
                    }
                });

                // loop though the travel and add the value to the corresponding year
                travelList.forEach(travel => {
                    const travelYear = new Date(travel.dream_date).getFullYear();
                    const travelValue = parseFloat(travel.amount);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === travel.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(travelValue * conversionRate);
                    // find the corresponding row in the dreamsList array where year = travelYear and add the value to the travel column
                    dreamsList.find(dream => dream.year === travelYear).Travel += convertedValue;
                    if (travelYear > maxYear) maxYear = travelYear;
                });

                // loop though the relocation and add the value to the corresponding year
                relocationList.forEach(relocation => {
                    const relocationYear = new Date(relocation.dream_date).getFullYear();
                    const relocationValue = parseFloat(relocation.amount);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === relocation.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(relocationValue * conversionRate);
                    // find the corresponding row in the dreamsList array where year = relocationYear and add the value to the relocation column
                    dreamsList.find(dream => dream.year === relocationYear).Relocation += convertedValue;
                    if (relocationYear > maxYear) maxYear = relocationYear;
                });
                
                // loop though the other dreams and add the value to the corresponding year
                otherList.forEach(other => {
                    const otherYear = new Date(other.dream_date).getFullYear();
                    const otherValue = parseFloat(other.amount);
                    const exchangeRate = ExchangeRate.find(rate => rate.from === other.currency && rate.to === currentUserBaseCurrency);
                    const conversionRate = exchangeRate ? exchangeRate.value : 1;
                    const convertedValue = parseFloat(otherValue * conversionRate);
                    // find the corresponding row in the dreamsList array where year = otherYear and add the value to the other column
                    dreamsList.find(dream => dream.year === otherYear).Other += convertedValue;
                    if (otherYear > maxYear) maxYear = otherYear;
                });    
                
                // loop through the dreamsList array from maxYear + 1 to end of array and delete all these rows as these are empty rows
                for (let i = year; i <= (year + 50); i++) {                    
                    dreamsList.find(dream => dream.year === i).total_value =   
                        dreamsList.find(dream => dream.year === i).Property +
                        dreamsList.find(dream => dream.year === i).Vehicle +
                        dreamsList.find(dream => dream.year === i).Education +
                        dreamsList.find(dream => dream.year === i).Travel +
                        dreamsList.find(dream => dream.year === i).Relocation +
                        dreamsList.find(dream => dream.year === i).Other;
                    
                    if (i > maxYear) {
                        dreamsList.splice(dreamsList.findIndex(dream => dream.year === i), 1);
                    }
                }

                // set state for dreamsList
                setDreamsList(dreamsList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

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
                            <DreamsGraph dreamsList={dreamsList}/>
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
                                        Properties ({propertyCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.Property, 0))}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetPropertyList ref={propertyListRef} onPropertiesFetched={handlePropertiesFetched} listAction={'Dream'} propertiesList={properties}/>
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
                                        Vehicles ({vehicleCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.Vehicle, 0))}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <AssetVehicleList ref={vehicleListRef} onVehiclesFetched={handleVehiclesFetched} listAction={'Dream'} vehiclesList={vehicles}/>
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
                                        Education ({educationCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.Education, 0))}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DreamList ref={educationListRef} onDreamsFetched={handleEducationFetched} dreamType={'Education'} dreamsList={education}/>
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
                                        Travel ({travelCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.Travel, 0))}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DreamList ref={travelListRef} onDreamsFetched={handleTravelFetched} dreamType={'Travel'} dreamsList={travel}/>
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
                                        Relocation ({relocationCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.Relocation, 0))}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DreamList ref={relocationListRef} onDreamsFetched={handleRelocationFetched} dreamType={'Relocation'} dreamsList={relocation}/>
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
                                        Other Dreams ({otherCount}) -&nbsp;<strong style={{ color: 'brown' }}>({currentUserBaseCurrency}) {FormatCurrency(currentUserBaseCurrency, dreamsList.reduce((acc, curr) => acc + curr.Other, 0))}</strong>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DreamList ref={otherListRef} onDreamsFetched={handleOtherFetched} dreamType={'Other'} dreamsList={other}/>
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