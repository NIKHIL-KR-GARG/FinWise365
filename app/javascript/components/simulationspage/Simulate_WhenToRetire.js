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

    let updatedIncomes = [];

    // Create a deep copy of incomesData
    let incomesCopy = JSON.parse(JSON.stringify(incomesData));

    let [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
        propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
        homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
        currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
        setErrorMessage
    );

    let [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow] = [assetsCashflow, liabilitiesCashflow, netCashflow];

    const today = new Date();
    // derive current age
    const dob = new Date(currentUserDateOfBirth);
    const ageDifMs = today - dob;
    let age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
    const retirementAge = parseInt(localStorage.getItem('currentUserRetirementAge'));
    const retirementDate = new Date(today.getFullYear() + (retirementAge - age), today.getMonth(), today.getDate());

    // check if today's status is all positive liquid_assets. If yes, we can reduce income end_date else we need to move in the other direction and start increasing it
    let isCurrentCashflowPositive = true;
    // loop through netCashflow and see if each month liquid_assets is positive
    for (let i = 0; i < netCashflow.length; i++) {
        if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
            isCurrentCashflowPositive = false;
            break;
        }
    }

    if (isCurrentCashflowPositive) {
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
                return [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow, updatedIncomes];
            }
            else {

                [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow] = [assetsCashflow, liabilitiesCashflow, netCashflow];

                // check all incomes which are recurring
                // find out the last recurring income and what is the end_date
                // if end_date is null, then it is recurring till the retirement age
                // if end_date is not null, then it is recurring till the end_date
                // reduce one month from the end_date of that income
                // and generate the cashflow again

                let lastRecurringIncomeEndDate = new Date();
                // let lastRecurringIncomeAmount = 0;
                let lastRecurringIncome = null;
                let lastRecurringIncomeIndex = -1;
                for (let i = 0; i < incomesData.length; i++) {
                    if (incomesData[i].is_recurring) {
                        if (incomesData[i].end_date) {
                            let incomeEndDate = new Date(incomesData[i].end_date);
                            if (incomeEndDate > lastRecurringIncomeEndDate) {
                                lastRecurringIncomeEndDate = incomeEndDate;
                                // lastRecurringIncomeAmount = incomesData[i].amount;
                                lastRecurringIncome = incomesData[i];
                                lastRecurringIncomeIndex = i;
                            }
                        }
                        else {
                            lastRecurringIncomeEndDate = retirementDate;
                            // lastRecurringIncomeAmount = incomesData[i].amount;
                            lastRecurringIncome = incomesData[i];
                            lastRecurringIncomeIndex = i;
                        }
                    }
                }

                // break, in case this becomes an infinite loop
                if (!lastRecurringIncomeEndDate || lastRecurringIncomeEndDate <= today) {
                    break;
                }

                let n = 0;
                if (lastRecurringIncome.income_frequency === 'Monthly') n = 1;
                else if (lastRecurringIncome.income_frequency === 'Quarterly') n = 3;
                else if (lastRecurringIncome.income_frequency === 'Semi-Annually') n = 6;
                else if (lastRecurringIncome.income_frequency === 'Annually') n = 12;

                lastRecurringIncomeEndDate.setMonth(lastRecurringIncomeEndDate.getMonth() - n);
                incomesData[lastRecurringIncomeIndex].end_date = lastRecurringIncomeEndDate;
                incomesCopy = JSON.parse(JSON.stringify(incomesData));

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

                [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
                    propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
                    homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
                    currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                    setErrorMessage
                );
            }
        }
        return [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow, updatedIncomes];
    }
    else {
        while (true) {

            let liquidAssetIsPositive = true;
            // loop through netCashflow and see if each month liquid_assets is positive
            for (let i = 0; i < netCashflow.length; i++) {
                if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
                    liquidAssetIsPositive = false;
                    break;
                }
            }

            // if liquid_assets is all positive, then this is the answer till when i need the income
            if (liquidAssetIsPositive) {
                return [assetsCashflow, liabilitiesCashflow, netCashflow, updatedIncomes];
            }
            else {

                [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow] = [assetsCashflow, liabilitiesCashflow, netCashflow];

                // check all incomes which are recurring
                // find out the fiest recurring income that is stopping and what is the end_date
                // if end_date is null, then it is recurring till the retirement age
                // if end_date is not null, then it is recurring till the end_date
                // add one month to the end_date of that income
                // and generate the cashflow again

                let lastRecurringIncomeEndDate = new Date(retirementDate);
                // let lastRecurringIncomeAmount = 0;
                let lastRecurringIncome = null;
                let lastRecurringIncomeIndex = -1;
                for (let i = 0; i < incomesData.length; i++) {
                    if (incomesData[i].is_recurring) {
                        if (incomesData[i].end_date) {
                            let incomeEndDate = new Date(incomesData[i].end_date);
                            if (incomeEndDate < lastRecurringIncomeEndDate) {
                                lastRecurringIncomeEndDate = incomeEndDate;
                                // lastRecurringIncomeAmount = incomesData[i].amount;
                                lastRecurringIncome = incomesData[i];
                                lastRecurringIncomeIndex = i;
                            }
                        }
                        else {
                            lastRecurringIncomeEndDate = retirementDate;
                            // lastRecurringIncomeAmount = incomesData[i].amount;
                            lastRecurringIncome = incomesData[i];
                            lastRecurringIncomeIndex = i;
                        }
                    }
                }

                // break, in case this becomes an infinite loop
                if (!lastRecurringIncomeEndDate || lastRecurringIncomeEndDate > retirementDate) {
                    break;
                }

                let n = 0;
                if (lastRecurringIncome.income_frequency === 'Monthly') n = 1;
                else if (lastRecurringIncome.income_frequency === 'Quarterly') n = 3;
                else if (lastRecurringIncome.income_frequency === 'Semi-Annually') n = 6;
                else if (lastRecurringIncome.income_frequency === 'Annually') n = 12;

                lastRecurringIncomeEndDate.setMonth(lastRecurringIncomeEndDate.getMonth() + n);
                incomesData[lastRecurringIncomeIndex].end_date = lastRecurringIncomeEndDate;
                incomesCopy = JSON.parse(JSON.stringify(incomesData));

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
}

const Simulate_WhenToRetire = () => {

    const hasFetchedData = useRef(false);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [cashflowAssetsData, setCashflowAssetsData] = useState([]);
    const [cashflowLiabilitiesData, setCashflowLiabilitiesData] = useState([]);
    const [cashflowNetData, setCashflowNetData] = useState([]);

    const [updatedIncomesData, setUpdatedIncomesData] = useState([]);

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

                const [assets, liabilities, net, updatedIncomes] = RunSimulation(properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets,
                    homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams,
                    currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                    setErrorMessage);

                setCashflowAssetsData(assets);
                setCashflowLiabilitiesData(liabilities);
                setCashflowNetData(net);
                setUpdatedIncomesData(updatedIncomes);

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
    }, []);

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
                        <CashFlowCommentary netCashflows={cashflowNetData} incomes={updatedIncomesData} sourcePage={'Simulate_WhenToRetire'} />
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