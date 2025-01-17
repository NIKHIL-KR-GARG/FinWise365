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
import { v4 as uuidv4 } from 'uuid';
import { getMonth } from '../common/DateFunctions';

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
    setErrorMessage, corpusAmount) => {

    // let updatedIncomes = [];
    // let assetsCashflow = [];
    // let liabilitiesCashflow = [];
    // let netCashflow = [];
    // let assetsPrevCashflow = [];
    // let liabilitiesPrevCashflow = [];
    // let netPrevCashflow = [];

    // Create a deep copy of incomesData
    // let incomesCopy = JSON.parse(JSON.stringify(incomesData));

    let [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
        propertiesData, vehiclesData, accountsData, depositsData, incomesData, portfoliosData, otherAssetsData,
        homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
        currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
        setErrorMessage
    );

    return [assetsCashflow, liabilitiesCashflow, netCashflow];

    // const today = new Date();
    // // using sabbaticalMonth, sabbaticalYear and  sabbaticalDuration create sabbatical_start_date and sabbatical_end_date
    // const sabbaticalStartDate = new Date(sabbaticalYear, getMonth(sabbaticalMonth) - 1, 1);
    // const sabbaticalEndDate =  (new Date(sabbaticalStartDate)).setMonth(sabbaticalStartDate.getMonth() + sabbaticalDuration);

    // // derive current age
    // const dob = new Date(currentUserDateOfBirth);
    // const ageDifMs = today - dob;
    // let age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
    // const retirementAge = parseInt(localStorage.getItem('currentUserRetirementAge'));
    // const retirementDate = new Date(today.getFullYear() + (retirementAge - age), today.getMonth(), today.getDate());

    // // check if today's status is all positive liquid_assets. If yes, only then we can consider a sabbaatical in the future
    // let isCurrentCashflowPositive = true;
    // // loop through netCashflow and see if each month liquid_assets is positive
    // for (let i = 0; i < netCashflow.length; i++) {
    //     if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
    //         isCurrentCashflowPositive = false;
    //         break;
    //     }
    // }

    // // loop through all incomes and see if any incomes falls between the sabbatical start and end date
    // for (let i = 0; i < incomesData.length; i++) {
        
    //     const incomeStartDate = new Date(incomesData[i].start_date);
    //     let income1 =  JSON.parse(JSON.stringify(incomesData[i]));
    //     let income2 =  JSON.parse(JSON.stringify(incomesData[i]));

    //     if (incomesData[i].is_recurring) {

    //         // derive income end date
    //         let incomeEndDate = new Date();
    //         if (incomesData[i].end_date) 
    //             incomeEndDate = new Date(incomesData[i].end_date);
    //         else 
    //             incomeEndDate = retirementDate;

    //         // if income is fully within sabbatical start and end date, then remove this income from incomesCopy
    //         if (incomeStartDate >= sabbaticalStartDate && incomeEndDate <= sabbaticalEndDate) {
    //             incomesCopy = incomesCopy.filter(income => income.id !== incomesData[i].id);
    //             // add this income to updatedIncomes
    //             updatedIncomes.push(incomesData[i]);
    //         }
    //         // else if income is partially within sabbatical start and end date, then see where it lies in the sabbatical period
    //         else if (incomeStartDate >= sabbaticalStartDate) {
    //             // part 1 with income start_date as sabbatical_end_date
    //             income1.id = uuidv4(); // generate unique ID for income1
    //             income1.start_date = sabbaticalEndDate;
    //             // remove this income from incomesCopy and add income1
    //             incomesCopy = incomesCopy.filter(income => income.id !== incomesData[i].id);
    //             incomesCopy.push(income1);
    //             // add this income to updatedIncomes
    //             updatedIncomes.push(income1);
    //         }
    //         else if (incomeStartDate < sabbaticalStartDate && incomeEndDate >= sabbaticalEndDate) {
    //             // part 2 with 2 incomes, one with end_date as sabbatical_start_date and other with start_date as sabbatical_end_date
    //             income1.id = uuidv4(); // generate unique ID for income1
    //             income1.end_date = sabbaticalStartDate;
    //             income2.id = uuidv4(); // generate unique ID for income2
    //             income2.start_date = sabbaticalEndDate;
    //             // remove this income from incomesCopy and add income2
    //             incomesCopy = incomesCopy.filter(income => income.id !== incomesData[i].id);
    //             incomesCopy.push(income1);
    //             incomesCopy.push(income2);
    //             // add this income to updatedIncomes
    //             updatedIncomes.push(income1);
    //             updatedIncomes.push(income2);
    //         }
    //         else if (incomeEndDate < sabbaticalEndDate) {
    //             // part 3 with end_date as sabbatical_start_date
    //             income1.id = uuidv4(); // generate unique ID for income1
    //             income1.end_date = sabbaticalStartDate;
    //             // remove this income from incomesCopy and add income1
    //             incomesCopy = incomesCopy.filter(income => income.id !== incomesData[i].id);
    //             incomesCopy.push(income1);
    //             // add this income to updatedIncomes
    //             updatedIncomes.push(income1);
    //         }
    //     }
    //     else {
    //         if (incomeStartDate >= sabbaticalStartDate && incomeStartDate <= sabbaticalEndDate) {
    //             // if this is not a recurring income, then remove this income from incomesCopy
    //             incomesCopy = incomesCopy.filter(income => income.id !== incomesData[i].id);

    //             // add this income to updatedIncomes
    //             updatedIncomes.push(incomesData[i]);
    //         }
    //     }
    // }

    // if (isCurrentCashflowPositive) {
    //     // if current cashflow is positive, then current income is sufficient, hence we can think about a sabbatical
    //     // Create a deep copy of incomesCopy
    //     let incomesCopyCopy = JSON.parse(JSON.stringify(incomesCopy));

    //     // assetsPrevCashflow = JSON.parse(JSON.stringify(assetsCashflow));
    //     // liabilitiesPrevCashflow = JSON.parse(JSON.stringify(liabilitiesCashflow));
    //     // netPrevCashflow = JSON.parse(JSON.stringify(netCashflow));

    //     [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
    //         propertiesData, vehiclesData, accountsData, depositsData, incomesCopyCopy, portfoliosData, otherAssetsData,
    //         homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
    //         currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
    //         setErrorMessage
    //     );

    //     // return the new cashflows and updatedIncomes
    //     return [assetsCashflow, liabilitiesCashflow, netCashflow, updatedIncomes];

    // }
    // else {
    //     // if current cashflow is negative, then current income is insufficient, hence no point in thinking about a sabbatical
    //     return [assetsCashflow, liabilitiesCashflow, netCashflow, null];
    // }
}

const Simulate_Corpus = ({ corpusAmount }) => {

    const hasFetchedData = useRef(false);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [cashflowAssetsData, setCashflowAssetsData] = useState([]);
    const [cashflowLiabilitiesData, setCashflowLiabilitiesData] = useState([]);
    const [cashflowNetData, setCashflowNetData] = useState([]);

    // const [updatedIncomesData, setUpdatedIncomesData] = useState([]);

    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');
    const currentUserLifeExpectancy = parseInt(localStorage.getItem('currentUserLifeExpectancy'));
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserDateOfBirth = new Date(localStorage.getItem('currentUserDateOfBirth'));

    useEffect(() => {
        const fetchDataAndRunSimulation = async () => {
            try {
                const data = await fetchData(currentUserId, currentUserDisplayDummyData, setLoading, setErrorMessage);
                const { properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets, homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams } = data;

                const [assets, liabilities, net] = RunSimulation(properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets,
                    homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams,
                    currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                    setErrorMessage, corpusAmount);

                setCashflowAssetsData(assets);
                setCashflowLiabilitiesData(liabilities);
                setCashflowNetData(net);
                // setUpdatedIncomesData(updatedIncomes);

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