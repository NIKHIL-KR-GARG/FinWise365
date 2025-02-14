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
import { isSameMonthAndYear,getMonthEndDate, getMonth } from '../common/DateFunctions';

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
    setErrorMessage, retirementMonth, retirementYear) => {

    let updatedIncomes = [];
    let assetsCashflow = [];
    let liabilitiesCashflow = [];
    let netCashflow = [];
    let assetsPrevCashflow = [];
    let liabilitiesPrevCashflow = [];
    let netPrevCashflow = [];
    let updatedPrevIncomes = [];

    // Create a deep copy of incomesData
    let incomesCopy = JSON.parse(JSON.stringify(incomesData));

    const today = new Date();
    const dob = new Date(currentUserDateOfBirth);
    const ageDifMs = today - dob;
    let age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
    let fixedRetirementDate = false;
    const retirementAge = parseInt(localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientRetirementAge') : localStorage.getItem('currentUserRetirementAge'));
    let retirementDate = new Date();
    
    // check if the ask is to do a generic simulation or with a specific retirement date entered by the user
    if (retirementMonth && retirementYear) {
        retirementDate = new Date(retirementYear, getMonth(retirementMonth) - 1, today.getDate());
        fixedRetirementDate = true;
    }
    else {
        retirementDate = new Date(today.getFullYear() + (retirementAge - age), today.getMonth(), today.getDate());
    }

    // if this is a generic simulation with a specific retirement date entered by the user then run the full simulation
    if (!fixedRetirementDate) {
        [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
            propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
            homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
            currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
            setErrorMessage
        );

        [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow, updatedPrevIncomes] = [assetsCashflow, liabilitiesCashflow, netCashflow, updatedIncomes];

        // check if today's status is all positive liquid_assets. If yes, we can reduce income end_date
        let isCurrentCashflowPositive = true;
        // loop through netCashflow and see if each month liquid_assets is positive
        for (let i = 0; i < netCashflow.length; i++) {
            if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
                isCurrentCashflowPositive = false;
                break;
            }
        }

        if (isCurrentCashflowPositive) {

            // check that cashflow is positive till there is regular income
            let lastRecurringIncomeEndDateToCheck = today;

            for (let i = 0; i < incomesData.length; i++) {
                if (incomesData[i].is_recurring) {
                    if (incomesData[i].end_date) {
                        // check that incomeEndDate should be greater than today and also greater than incomeStartDate
                        if (new Date(incomesData[i].end_date) > today && new Date(incomesData[i].end_date) > lastRecurringIncomeEndDateToCheck) {
                            lastRecurringIncomeEndDateToCheck = new Date(incomesData[i].end_date);
                        }
                    }
                }
                else {
                    lastRecurringIncomeEndDateToCheck = retirementDate;
                }
            }

            const monthToCheck = lastRecurringIncomeEndDateToCheck.getMonth() + 1;
            const yearToCheck = lastRecurringIncomeEndDateToCheck.getFullYear();
            let incomesCashFlowIsPositive = true;
            // loop through netCashflow and see if each month liquid_assets till we have the income flowing in
            for (let i = 0; i < netCashflow.length; i++) {
                if (netCashflow[i] &&
                    (parseInt(netCashflow[i].year) < yearToCheck ||
                        (parseInt(netCashflow[i].year) === yearToCheck && parseInt(netCashflow[i].month) <= monthToCheck)
                    ) && parseFloat(netCashflow[i].liquid_assets) < 0) {
                    incomesCashFlowIsPositive = false;
                    break;
                }
            }

            // if the cashflow is negative even when we have the income flowing, then current income is insufficient, hence no point in incerasing or decreasing the end date
            // ask the user to use the other simuation to see how much current income should be increased
            if (!incomesCashFlowIsPositive) {
                return [assetsCashflow, liabilitiesCashflow, netCashflow, null];
            }

            while (true) {

                let liquidAssetIsPositive = true;
                // loop through netCashflow and see if each month liquid_assets is positive
                for (let i = 0; i < netCashflow.length; i++) {
                    if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
                        liquidAssetIsPositive = false;
                        break;
                    }
                }

                // if liquid_assets is negative ever, then the prev cash flow is the right answer
                if (!liquidAssetIsPositive) {
                    return [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow, updatedPrevIncomes];
                }
                else {

                    [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow, updatedPrevIncomes] = [assetsCashflow, liabilitiesCashflow, netCashflow, updatedIncomes];

                    // check all incomes which are recurring
                    // find out the last recurring income and what is the end_date
                    // if end_date is null, then it is recurring till the retirement age
                    // if end_date is not null, then it is recurring till the end_date
                    // reduce one month from the end_date of that income
                    // and generate the cashflow again

                    let lastRecurringIncomeEndDate = today;// getMonthEndDate(today.getMonth() + 1, today.getFullYear());
                    let lastRecurringIncome = null;
                    let lastRecurringIncomeIndex = -1;
                    for (let i = 0; i < incomesData.length; i++) {
                        if (incomesData[i].is_recurring) {
                            if (incomesData[i].end_date) {
                                let incomeEndDate = new Date(incomesData[i].end_date);
                                let incomeStartDate = new Date(incomesData[i].start_date);
                                // check that incomeEndDate should be greater than today and also greater than incomeStartDate
                                if (incomeEndDate > today && !isSameMonthAndYear(incomeEndDate, today) &&
                                    incomeEndDate > incomeStartDate && !isSameMonthAndYear(incomeEndDate, incomeStartDate)) {
                                    if (incomeEndDate > lastRecurringIncomeEndDate) {
                                        lastRecurringIncomeEndDate = incomeEndDate;
                                        lastRecurringIncome = incomesData[i];
                                        lastRecurringIncomeIndex = i;
                                    }
                                }
                            }
                            else {
                                lastRecurringIncomeEndDate = retirementDate;
                                lastRecurringIncome = incomesData[i];
                                lastRecurringIncomeIndex = i;
                            }
                        }
                    }

                    // break, in case this becomes an infinite loop
                    if (!lastRecurringIncome) {
                        break;
                    }

                    let n = 0;
                    if (lastRecurringIncome.income_frequency === 'Monthly') n = 1;
                    else if (lastRecurringIncome.income_frequency === 'Quarterly') n = 3;
                    else if (lastRecurringIncome.income_frequency === 'Semi-Annually') n = 6;
                    else if (lastRecurringIncome.income_frequency === 'Annually') n = 12;

                    lastRecurringIncomeEndDate = getMonthEndDate(lastRecurringIncomeEndDate.getMonth() - n + 1, lastRecurringIncomeEndDate.getFullYear());
                    incomesData[lastRecurringIncomeIndex].end_date = lastRecurringIncomeEndDate;

                    // check if this income already exists in updatedIncomes
                    // if yes, update the new_end_date
                    // else add this income to updatedIncomes
                    let isIncomeUpdated = false;
                    for (let i = 0; i < updatedIncomes.length; i++) {
                        if (updatedIncomes[i].id === lastRecurringIncome.id) {
                            updatedIncomes[i].updated_end_date = lastRecurringIncomeEndDate;
                            isIncomeUpdated = true;
                            break;
                        }
                    }
                    if (!isIncomeUpdated) {
                        // find this income in incomesCopy and add end_date from there
                        const lastRecurringIncomeCopy = incomesCopy.find(income => income.id === lastRecurringIncome.id);
                        updatedIncomes.push({
                            id: lastRecurringIncome.id,
                            income_name: lastRecurringIncome.income_name,
                            income_type: lastRecurringIncome.income_type,
                            location: lastRecurringIncome.location,
                            currency: lastRecurringIncome.currency,
                            amount: lastRecurringIncome.amount,
                            start_date: lastRecurringIncome.start_date,
                            end_date: lastRecurringIncomeCopy.end_date, // take form incomesCopy as lastRecurringIncome keeps changing
                            updated_end_date: lastRecurringIncomeEndDate
                        });
                    }

                    incomesCopy = JSON.parse(JSON.stringify(incomesData));

                    [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
                        propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
                        homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
                        currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                        setErrorMessage
                    );
                }
            }
            return [assetsCashflow, liabilitiesCashflow, netCashflow, updatedIncomes];
        }
        else {
            // if current cashflow is negative, then current income is insufficient, hence no point in incerasing or decreasing the end date
            // ask the user to use the other simuation to see how much current income should be increased
            return [assetsCashflow, liabilitiesCashflow, netCashflow, null];
        }
    }
    else {
        // loop through all the incomes and if anyone has an end date more than the retirement date, then reduce the end date to retirement date
        let isIncomeUpdated = false;
        let originalEndDate = null;
        for (let i = 0; i < incomesData.length; i++) {
            if (incomesData[i].is_recurring) {
                isIncomeUpdated = false;
                originalEndDate = null;
                if (incomesData[i].end_date) {
                    if (new Date(incomesData[i].end_date) > retirementDate) {
                        originalEndDate = incomesData[i].end_date;
                        incomesData[i].end_date = retirementDate;
                        isIncomeUpdated = true;
                    }
                }
                else {
                    incomesData[i].end_date = retirementDate;
                    originalEndDate = null;
                    isIncomeUpdated = true;
                }
                if (isIncomeUpdated) {
                    updatedIncomes.push({
                        id: incomesData[i].id,
                        income_name: incomesData[i].income_name,
                        income_type: incomesData[i].income_type,
                        location: incomesData[i].location,
                        currency: incomesData[i].currency,
                        amount: incomesData[i].amount,
                        start_date: incomesData[i].start_date,
                        end_date: originalEndDate,
                        updated_end_date: retirementDate
                    });
                }
            }
        }

        incomesCopy = JSON.parse(JSON.stringify(incomesData));

        // generate the cashflow
        [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
            propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
            homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
            currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
            setErrorMessage
        );

        // loop through netCashflow and see if each month liquid_assets is positive
        let isCurrentCashflowPositive = true;
        for (let i = 0; i < netCashflow.length; i++) {
            if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
                isCurrentCashflowPositive = false;
                break;
            }
        }
        if (isCurrentCashflowPositive) {
            return [assetsCashflow, liabilitiesCashflow, netCashflow, updatedIncomes];
        }
        else {
            return [assetsCashflow, liabilitiesCashflow, netCashflow, null];
        }
    }
}

const Simulate_WhenToRetire = ({ retirementMonth, retirementYear }) => {

    const hasFetchedData = useRef(false);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isFixedRetirementDate, setIsFixedRetirementDate] = useState(false);

    const [cashflowAssetsData, setCashflowAssetsData] = useState([]);
    const [cashflowLiabilitiesData, setCashflowLiabilitiesData] = useState([]);
    const [cashflowNetData, setCashflowNetData] = useState([]);
    const [updatedIncomesData, setUpdatedIncomesData] = useState([]);

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

                const [assets, liabilities, net, updatedIncomes] = RunSimulation(properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets,
                    homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams,
                    currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                    setErrorMessage, retirementMonth, retirementYear);

                setCashflowAssetsData(assets);
                setCashflowLiabilitiesData(liabilities);
                setCashflowNetData(net);
                setUpdatedIncomesData(updatedIncomes);
                setIsFixedRetirementDate(retirementMonth && retirementYear);

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
    }, [retirementMonth, retirementYear]);

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
                        <CashFlowCommentary netCashflows={cashflowNetData} incomes={updatedIncomesData} isFixedRetirementDate={isFixedRetirementDate} corpus={0} sourcePage={'Simulate_WhenToRetire'} />
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

export default Simulate_WhenToRetire;