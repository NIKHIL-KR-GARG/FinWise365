import React, { useState, useEffect, useRef } from 'react';
import { fetchAssetLiabilityIncomeData, generateCashflow } from '../cashflowpage/GenerateCashfows';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';
import NetCashflow from '../cashflowpage/NetCashflow';
import AssetsCashflow from '../cashflowpage/AssetsCashflow';
import LiabilitiesCashflow from '../cashflowpage/LiabilitiesCashflow';
import CashFlowCommentary from '../cashflowpage/CashFlowCommentary';

const fetchData = async (currentUserId, currentUserDisplayDummyData, setLoading, setErrorMessage) => {
    try {
        const data = await fetchAssetLiabilityIncomeData(currentUserId, currentUserDisplayDummyData, setLoading, setErrorMessage);
        return data;
    }
    catch (err) {
        setErrorMessage(err.message);
    }
}

const RunSimulation = (propertiesData, vehiclesData, accountsData, depositsData, incomesData, portfoliosData, otherAssetsData,
    homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
    currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
    setErrorMessage) => {

    let [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
        propertiesData, vehiclesData, accountsData, depositsData, incomesData, portfoliosData, otherAssetsData,
        homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
        currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
        setErrorMessage
    );

    return [assetsCashflow, liabilitiesCashflow, netCashflow];
}

const Simulate_Corpus = ({ corpusAmount }) => {

    const hasFetchedData = useRef(false);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [cashflowAssetsData, setCashflowAssetsData] = useState([]);
    const [cashflowLiabilitiesData, setCashflowLiabilitiesData] = useState([]);
    const [cashflowNetData, setCashflowNetData] = useState([]);

    const currentUserId = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientID') : localStorage.getItem('currentUserId');
    const currentUserBaseCurrency = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientBaseCurrency') : localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentClientID') ? 'false' : localStorage.getItem('currentUserDisplayDummyData');
    const currentUserLifeExpectancy = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientLifeExpectancy') : localStorage.getItem('currentUserLifeExpectancy');
    const currentUserDateOfBirth = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientDateOfBirth') : localStorage.getItem('currentUserDateOfBirth');
    const currentUserCountryOfResidence = localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientCountryOfResidence') : localStorage.getItem('currentUserCountryOfResidence');

    useEffect(() => {
        const fetchDataAndRunSimulation = async () => {
            try {
                const data = await fetchData(currentUserId, currentUserDisplayDummyData, setLoading, setErrorMessage);
                const { properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets, homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams } = data;

                const [assets, liabilities, net] = RunSimulation(properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets,
                    homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams,
                    currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                    setErrorMessage);

                setCashflowAssetsData(assets);
                setCashflowLiabilitiesData(liabilities);
                setCashflowNetData(net);

                hasFetchedData.current = true;
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (!hasFetchedData.current) {
            fetchDataAndRunSimulation();
        }
    }, [corpusAmount]);

    return (
        <Box position="relative">
            {(loading) && (
                <Box display="flex" justifyContent="center" alignItems="center" position="fixed" top={0} left={0} right={0} bottom={0} zIndex={9999} bgcolor="rgba(255, 255, 255, 0.8)" pointerEvents="none">
                    <CircularProgress style={{ pointerEvents: 'auto' }} />
                </Box>
            )}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="success"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setSuccessMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setErrorMessage('')}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Box sx={{ p: 2, boxShadow: 3, borderRadius: 1, bgcolor: 'background.paper' }}>
                {!loading && (
                    <>
                        <CashFlowCommentary netCashflows={cashflowNetData} incomes={null} isFixedRetirementDate={false} corpus={corpusAmount} sourcePage={'Simulate_Corpus'} />
                        <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, border: '1px solid', borderColor: 'divider' }} defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <SavingsOutlinedIcon sx={{ mr: 1, color: 'green' }} />
                                        Net Worth
                                    </Box>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <NetCashflow netCashflowData={cashflowNetData} />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, border: '1px solid', borderColor: 'divider' }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <TrendingUpOutlinedIcon sx={{ mr: 1, color: 'purple' }} />
                                    My Assets
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <AssetsCashflow assetsCashflowData={cashflowAssetsData} />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ width: '100%', mb: 2, minHeight: 70, border: '1px solid', borderColor: 'divider' }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <MoneyOffOutlinedIcon sx={{ mr: 1, color: 'purple' }} />
                                    My Expenses
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <LiabilitiesCashflow liabilitiesCashflowData={cashflowLiabilitiesData} />
                            </AccordionDetails>
                        </Accordion>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default Simulate_Corpus;