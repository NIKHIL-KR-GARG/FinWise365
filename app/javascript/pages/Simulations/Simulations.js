import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Link, Typography, Breadcrumbs, Divider, Accordion, AccordionSummary, AccordionDetails, Button, MenuItem, Select, FormControl, InputLabel, Alert, OutlinedInput } from '@mui/material';
import SimulationIcon from '@mui/icons-material/Science';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import HomeHeader from '../../components/homepage/HomeHeader';
import HomeLeftMenu from '../../components/homepage/HomeLeftMenu';
import { today } from '../../components/common/DateFunctions';

import Simulate_WhenToRetire from '../../components/simulationspage/Simulate_WhenToRetire';
import Simulate_ReduceIncome from '../../components/simulationspage/Simulate_ReduceIncome';
import Simulate_Sabbatical from '../../components/simulationspage/Simulate_Sabbatical';
import Simulate_Corpus from '../../components/simulationspage/Simulate_Corpus';

const Simulations = () => {

    const [open, setOpen] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const [showSimulate_WhenToRetire, setSimulate_WhenToRetire] = useState(false);
    const [showSimulate_ReduceIncome, setSimulate_ReduceIncome] = useState(false);
    const [sabbaticalMonth, setSabbaticalMonth] = useState('');
    const [sabbaticalYear, setSabbaticalYear] = useState('');
    const [sabbaticalDuration, setSabbaticalDuration] = useState('');
    const [showSimulate_Sabbatical, setSimulate_Sabbatical] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [retirementMonth, setRetirementMonth] = useState('');
    const [retirementYear, setRetirementYear] = useState('');
    const [corpusAmount, setCorpusAmount] = useState('');
    const [showSimulate_Corpus, setSimulate_Corpus] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleSimulate_WhenToRetire = () => {
        setAlertMessage('');
        setSimulate_WhenToRetire(false);
        setSimulate_ReduceIncome(false);
        setSimulate_Sabbatical(false);
        setSimulate_Corpus(false);
        if (retirementMonth && retirementYear) {
            const currentDate = new Date();
            const selectedDate = new Date(retirementYear, retirementMonth - 1); // Month is 0-indexed
            if (selectedDate <= currentDate) {
                setAlertMessage("Please select a future date for the retirement.");
                return;
            }
        }
        setTimeout(() => setSimulate_WhenToRetire(true), 0);
    };

    const handleSimulate_ReduceIncome = () => {
        setAlertMessage('');
        setSimulate_WhenToRetire(false);
        setSimulate_ReduceIncome(false);
        setSimulate_Sabbatical(false);
        setSimulate_Corpus(false);
        setTimeout(() => setSimulate_ReduceIncome(true), 0);
    };

    const handleSimulate_Sabbatical = () => {
        setAlertMessage('');
        setSimulate_WhenToRetire(false);
        setSimulate_ReduceIncome(false);
        setSimulate_Sabbatical(false);
        setSimulate_Corpus(false);
        const currentDate = new Date();
        const selectedDate = new Date(sabbaticalYear, sabbaticalMonth - 1); // Month is 0-indexed
        if (selectedDate <= currentDate) {
            setAlertMessage("Please select a future date for the sabbatical.");
            return;
        }
        setTimeout(() => setSimulate_Sabbatical(true), 0);
    };

    const handleSimulate_Corpus = () => {
        setAlertMessage('');
        setSimulate_WhenToRetire(false);
        setSimulate_ReduceIncome(false);
        setSimulate_Sabbatical(false);
        setSimulate_Corpus(false);
        if (isNaN(corpusAmount) || corpusAmount <= 0) {
            setAlertMessage("Please enter a valid numeric corpus amount.");
            return;
        }
        setTimeout(() => setSimulate_Corpus(true), 0);
    };

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

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
                            Insights
                        </Link>
                        <Typography color="textPrimary">Simulations</Typography>
                    </Breadcrumbs>
                    <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SimulationIcon sx={{ mr: 1 }} />
                                My Simulations
                            </Box>
                            <Box sx={{ fontSize: '0.875rem' }}>
                                {'( '}Today, {today} {')'}
                            </Box>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        {alertMessage && <Alert severity="warning">{alertMessage}</Alert>}
                        <Box sx={{ width: '100%', p: 0, display: 'flex', justifyContent: 'left', pb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                                <Box sx={{ display: 'flex', alignItems: 'left' }}>
                                    What Insights would you like today? Please pick a question below.
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'left' }}>
                                    &nbsp;(if you have any other question in mind, please&nbsp;
                                    <Link underline="hover" color="primary" href="/contactus" sx={{ fontStyle: 'italic', textDecoration: 'underline' }}> 
                                        send us a message
                                    </Link> 
                                    &nbsp;and we will try to add it here)
                                </Box>
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', alignItems: 'left', pb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item size={6}>
                                    <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')} sx={{ bgcolor: '#fff9e6' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>I want to plan my retirement</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography component="ul">
                                                <li>Are my current savings and planned income enough to retire in Month & Year below?</li>
                                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                    <FormControl fullWidth variant="outlined" size="small" sx={{ flex: 1 }}>
                                                        <InputLabel id="retirement-month-label">Month</InputLabel>
                                                        <Select
                                                            labelId="retirement-month-label"
                                                            value={retirementMonth}
                                                            label="Month"
                                                            onChange={(e) => setRetirementMonth(e.target.value)}
                                                        >
                                                            <MenuItem value="January">January</MenuItem>
                                                            <MenuItem value="February">February</MenuItem>
                                                            <MenuItem value="March">March</MenuItem>
                                                            <MenuItem value="April">April</MenuItem>
                                                            <MenuItem value="May">May</MenuItem>
                                                            <MenuItem value="June">June</MenuItem>
                                                            <MenuItem value="July">July</MenuItem>
                                                            <MenuItem value="August">August</MenuItem>
                                                            <MenuItem value="September">September</MenuItem>
                                                            <MenuItem value="October">October</MenuItem>
                                                            <MenuItem value="November">November</MenuItem>
                                                            <MenuItem value="December">December</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined" size="small" sx={{ flex: 1 }}>
                                                        <InputLabel id="retirement-year-label">Year</InputLabel>
                                                        <Select
                                                            labelId="retirement-year-label"
                                                            value={retirementYear}
                                                            label="Year"
                                                            onChange={(e) => setRetirementYear(e.target.value)}
                                                        >
                                                            {years.map((year) => (
                                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        sx={{ fontSize: '0.75rem' }} 
                                                        onClick={handleSimulate_WhenToRetire}
                                                    >
                                                        Show me the Insights
                                                    </Button>
                                                </Box>
                                                <br />
                                                <li>Are my current savings and planned income enough to retire as per my current retirement date? Can I retire earlier or would have to delay to later?</li>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        sx={{ fontSize: '0.75rem' }} 
                                                        onClick={handleSimulate_WhenToRetire}
                                                    >
                                                        Show me the Insights
                                                    </Button>
                                                </Box>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid item size={6}>
                                    <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')} sx={{ bgcolor: '#e8f5e9' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>How about my recurring income?</Typography>
                                            {expanded === 'panel3' &&
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ ml: 'auto', fontSize: '0.75rem' }} 
                                                    onClick={handleSimulate_ReduceIncome}
                                                >
                                                    Show me the Insights
                                                </Button>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Can I reduce my current income and still achieve my financial goals? If yes, by how much can I reduce my income or do i need to increase it?
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid item size={6}>
                                <Accordion expanded={expanded === 'panel5'} onChange={handleAccordionChange('panel5')} sx={{ bgcolor: '#fce4ec' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Can I take a sabbatical?</Typography>
                                            {expanded === 'panel5' &&
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ ml: 'auto', fontSize: '0.75rem' }} 
                                                    onClick={handleSimulate_Sabbatical}
                                                >
                                                    Show me the Insights
                                                </Button>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                What if I take a sabbatical? Can I afford to take a break from work and still achieve my financial goals? 
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                <FormControl fullWidth variant="outlined" size="small" sx={{ flex: 1 }}>
                                                    <InputLabel id="sabbatical-month-label">Month</InputLabel>
                                                    <Select
                                                        labelId="sabbatical-month-label"
                                                        value={sabbaticalMonth}
                                                        label="Month"
                                                        onChange={(e) => setSabbaticalMonth(e.target.value)}
                                                    >
                                                        <MenuItem value="January">January</MenuItem>
                                                        <MenuItem value="February">February</MenuItem>
                                                        <MenuItem value="March">March</MenuItem>
                                                        <MenuItem value="April">April</MenuItem>
                                                        <MenuItem value="May">May</MenuItem>
                                                        <MenuItem value="June">June</MenuItem>
                                                        <MenuItem value="July">July</MenuItem>
                                                        <MenuItem value="August">August</MenuItem>
                                                        <MenuItem value="September">September</MenuItem>
                                                        <MenuItem value="October">October</MenuItem>
                                                        <MenuItem value="November">November</MenuItem>
                                                        <MenuItem value="December">December</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth variant="outlined" size="small" sx={{ flex: 1 }}>
                                                    <InputLabel id="sabbatical-year-label">Year</InputLabel>
                                                    <Select
                                                        labelId="sabbatical-year-label"
                                                        value={sabbaticalYear}
                                                        label="Year"
                                                        onChange={(e) => setSabbaticalYear(e.target.value)}
                                                    >
                                                        {years.map((year) => (
                                                            <MenuItem key={year} value={year}>{year}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 2 }}>
                                                <InputLabel id="sabbatical-duration-label">Duration (Months)</InputLabel>
                                                <Select
                                                    labelId="sabbatical-duration-label"
                                                    value={sabbaticalDuration}
                                                    label="Duration (Months)"
                                                    onChange={(e) => setSabbaticalDuration(e.target.value)}
                                                >
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={2}>2</MenuItem>
                                                    <MenuItem value={3}>3</MenuItem>
                                                    <MenuItem value={4}>4</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={6}>6</MenuItem>
                                                    <MenuItem value={7}>7</MenuItem>
                                                    <MenuItem value={8}>8</MenuItem>
                                                    <MenuItem value={9}>9</MenuItem>
                                                    <MenuItem value={10}>10</MenuItem>
                                                    <MenuItem value={11}>11</MenuItem>
                                                    <MenuItem value={12}>12</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid item size={6}>
                                    <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')} sx={{ bgcolor: '#fff3e0' }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>When will I reach a particular corpus (cash assets)?</Typography>
                                            {expanded === 'panel4' &&
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ ml: 'auto', fontSize: '0.75rem' }} 
                                                    onClick={handleSimulate_Corpus}
                                                >
                                                    Show me the Insights
                                                </Button>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                When will I reach a particular corpus (cash assets) as per my current savings and planned income? Would that be enough to retire?
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                <FormControl fullWidth variant="outlined" size="small" sx={{ flex: 1 }}>
                                                    <InputLabel htmlFor="corpus-amount">Corpus Amount</InputLabel>
                                                    <OutlinedInput
                                                        id="corpus-amount"
                                                        value={corpusAmount}
                                                        label="Corpus Amount"
                                                        onChange={(e) => setCorpusAmount(e.target.value)}
                                                    />
                                                </FormControl>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {showSimulate_WhenToRetire && <Simulate_WhenToRetire retirementMonth={retirementMonth} retirementYear={retirementYear}/>}
                        {showSimulate_ReduceIncome && <Simulate_ReduceIncome />}
                        {showSimulate_Sabbatical && <Simulate_Sabbatical sabbaticalMonth={sabbaticalMonth} sabbaticalYear={sabbaticalYear} sabbaticalDuration={sabbaticalDuration} />}
                        {showSimulate_Corpus && <Simulate_Corpus corpusAmount={corpusAmount} />}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Simulations;