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
    let updatedPrevIncomes = [];
    let assetsPrevCashflow = [];
    let liabilitiesPrevCashflow = [];
    let netPrevCashflow = [];

    // Create a deep copy of incomesData
    let incomesCopy = JSON.parse(JSON.stringify(incomesData));

    let [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
        propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
        homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
        currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
        setErrorMessage
    );

    const today = new Date();
    // derive current age
    const dob = new Date(currentUserDateOfBirth);
    const ageDifMs = today - dob;
    let age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
    const retirementAge = parseInt(localStorage.getItem('currentClientID') ? localStorage.getItem('currentClientRetirementAge') : localStorage.getItem('currentUserRetirementAge'));
    const retirementDate = new Date(today.getFullYear() + (retirementAge - age), today.getMonth(), today.getDate());

    // check if today's status is all positive liquid_assets. If yes, we can reduce income else we need to move in the other direction and start increasing it
    let isCurrentCashflowPositive = true;
    // loop through netCashflow and see if each month liquid_assets is positive
    for (let i = 0; i < netCashflow.length; i++) {
        if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
            isCurrentCashflowPositive = false;
            break;
        }
    }

    // add all recurring incomes to updatedIncomes
    for (let i = 0; i < incomesData.length; i++) {
        if (incomesData[i].is_recurring) {
            updatedIncomes.push({
                id: incomesData[i].id,
                income_name: incomesData[i].income_name,
                income_type: incomesData[i].income_type,
                location: incomesData[i].location,
                currency: incomesData[i].currency,
                reductionPercentage: 100,
                percentageToApply: 0,
                original_amount: incomesData[i].amount,
                amount: incomesData[i].amount,
                updated_amount: incomesData[i].amount,
                start_date: incomesData[i].start_date,
                end_date: incomesData[i].end_date,
            });
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

            // loop through updatedIncomes and see if each income has been reduced as much as possible
            let isIncomeReduced = true;
            for (let i = 0; i < updatedIncomes.length; i++) {
                if (updatedIncomes[i].reductionPercentage > 1) {
                    isIncomeReduced = false;
                    break;
                }
            }

            // if income has been reduced fully, then return this or previous cashflow
            if (isIncomeReduced) {
                if (liquidAssetIsPositive) {
                    // remove all the rows from updatedIncomes where original_amount and updated_amount are same
                    updatedIncomes = updatedIncomes.filter(income => income.original_amount !== income.updated_amount);
                    return [assetsCashflow, liabilitiesCashflow, netCashflow, updatedIncomes];
                }
                else {
                    // remove all the rows from updatedPrevIncomes where original_amount and updated_amount are same
                    updatedPrevIncomes = updatedPrevIncomes.filter(income => income.original_amount !== income.updated_amount);
                    return [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow, updatedPrevIncomes];
                }
            }
            else {

                if (liquidAssetIsPositive) {
                    // make a copy of updatedIncomes in updatedPrevIncomes
                    updatedPrevIncomes = JSON.parse(JSON.stringify(updatedIncomes));
                    assetsPrevCashflow = JSON.parse(JSON.stringify(assetsCashflow));
                    liabilitiesPrevCashflow = JSON.parse(JSON.stringify(liabilitiesCashflow));
                    netPrevCashflow = JSON.parse(JSON.stringify(netCashflow));
                }

                // check all incomes which are recurring
                // find out the recurring income which has the farthest end_date
                // if end_date is null, then it is recurring till the retirement age
                // if end_date is not null, then it is recurring till the end_date
                // reduce reductionPercentage from that income
                // and generate the cashflow again

                let lastRecurringIncomeEndDate = new Date();
                let lastRecurringIncome = null;
                let lastRecurringIncomeIndex = -1;
                for (let i = 0; i < incomesData.length; i++) {
                    if (incomesData[i].is_recurring) {

                        // find this income in updatedIncomes and see if it has been fully reduced?
                        const incomeUpdated = updatedIncomes.find(income => income.id === incomesData[i].id);
                        if (incomeUpdated.reductionPercentage > 1) {

                            if (incomesData[i].end_date) {
                                let incomeEndDate = new Date(incomesData[i].end_date);
                                if (incomeEndDate > lastRecurringIncomeEndDate) {
                                    lastRecurringIncomeEndDate = incomeEndDate;
                                    lastRecurringIncome = incomesData[i];
                                    lastRecurringIncomeIndex = i;
                                }
                            }
                            else {
                                lastRecurringIncomeEndDate = retirementDate;
                                lastRecurringIncome = incomesData[i];
                                lastRecurringIncomeIndex = i;
                            }
                        }
                    }
                }

                if (lastRecurringIncome) {

                    // find this income in updatedIncomes
                    const lastRecurringIncomeUpdated = updatedIncomes.find(income => income.id === lastRecurringIncome.id);
                    let percentage = 0;
                    if (lastRecurringIncomeUpdated.percentageToApply === 0) {
                        percentage = 50;
                    }
                    else {
                        if (liquidAssetIsPositive) percentage = lastRecurringIncomeUpdated.percentageToApply - lastRecurringIncomeUpdated.reductionPercentage / 2;
                        else percentage = lastRecurringIncomeUpdated.percentageToApply + lastRecurringIncomeUpdated.reductionPercentage / 2;
                    }

                    incomesData[lastRecurringIncomeIndex].amount = parseFloat(lastRecurringIncomeUpdated.amount * (percentage / 100));
                    incomesCopy = JSON.parse(JSON.stringify(incomesData));

                    // update this income in updatedIncomes
                    for (let i = 0; i < updatedIncomes.length; i++) {
                        if (updatedIncomes[i].id === lastRecurringIncome.id) {
                            updatedIncomes[i].reductionPercentage = updatedIncomes[i].reductionPercentage / 2;
                            updatedIncomes[i].percentageToApply = percentage;
                            updatedIncomes[i].updated_amount = updatedIncomes[i].amount * (percentage / 100);
                            break;
                        }
                    }

                    [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
                        propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
                        homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
                        currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                        setErrorMessage
                    );
                }
            }
        }
    }
    else {
        let firstTimePositive = false;

        while (true) {

            if (firstTimePositive) {

                let liquidAssetIsPositive = true;
                // loop through netCashflow and see if each month liquid_assets is positive
                for (let i = 0; i < netCashflow.length; i++) {
                    if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
                        liquidAssetIsPositive = false;
                        break;
                    }
                }

                // loop through updatedIncomes and see if each income has been reduced as much as possible
                let isIncomeReduced = true;
                for (let i = 0; i < updatedIncomes.length; i++) {
                    if (updatedIncomes[i].reductionPercentage > 1) {
                        isIncomeReduced = false;
                        break;
                    }
                }

                // if income has been reduced fully, then return this or previous cashflow
                if (isIncomeReduced) {
                    if (liquidAssetIsPositive) {
                        // remove all the rows from updatedIncomes where original_amount and updated_amount are same
                        updatedIncomes = updatedIncomes.filter(income => income.original_amount !== income.updated_amount);
                        return [assetsCashflow, liabilitiesCashflow, netCashflow, updatedIncomes];
                    }
                    else {
                        // remove all the rows from updatedPrevIncomes where original_amount and updated_amount are same
                        updatedPrevIncomes = updatedPrevIncomes.filter(income => income.original_amount !== income.updated_amount);
                        return [assetsPrevCashflow, liabilitiesPrevCashflow, netPrevCashflow, updatedPrevIncomes];
                    }
                }
                else {

                    if (liquidAssetIsPositive) {
                        // make a copy of updatedIncomes in updatedPrevIncomes
                        updatedPrevIncomes = JSON.parse(JSON.stringify(updatedIncomes));
                        assetsPrevCashflow = JSON.parse(JSON.stringify(assetsCashflow));
                        liabilitiesPrevCashflow = JSON.parse(JSON.stringify(liabilitiesCashflow));
                        netPrevCashflow = JSON.parse(JSON.stringify(netCashflow));
                    }

                    // check all incomes which are recurring
                    // find out the recurring income which has the farthest end_date
                    // if end_date is null, then it is recurring till the retirement age
                    // if end_date is not null, then it is recurring till the end_date
                    // reduce reductionPercentage from that income
                    // and generate the cashflow again

                    let lastRecurringIncomeEndDate = new Date();
                    let lastRecurringIncome = null;
                    let lastRecurringIncomeIndex = -1;
                    for (let i = 0; i < incomesData.length; i++) {
                        if (incomesData[i].is_recurring) {

                            // find this income in updatedIncomes and see if it has been fully reduced?
                            const incomeUpdated = updatedIncomes.find(income => income.id === incomesData[i].id);
                            if (incomeUpdated.reductionPercentage > 1) {

                                if (incomesData[i].end_date) {
                                    let incomeEndDate = new Date(incomesData[i].end_date);
                                    if (incomeEndDate > lastRecurringIncomeEndDate) {
                                        lastRecurringIncomeEndDate = incomeEndDate;
                                        lastRecurringIncome = incomesData[i];
                                        lastRecurringIncomeIndex = i;
                                    }
                                }
                                else {
                                    lastRecurringIncomeEndDate = retirementDate;
                                    lastRecurringIncome = incomesData[i];
                                    lastRecurringIncomeIndex = i;
                                }
                            }
                        }
                    }

                    if (lastRecurringIncome) {
                        // find this income in updatedIncomes
                        const lastRecurringIncomeUpdated = updatedIncomes.find(income => income.id === lastRecurringIncome.id);
                        let percentage = 0;
                        if (lastRecurringIncomeUpdated.percentageToApply === 0) {
                            percentage = 50;
                        }
                        else {
                            if (liquidAssetIsPositive) percentage = lastRecurringIncomeUpdated.percentageToApply - lastRecurringIncomeUpdated.reductionPercentage / 2;
                            else percentage = lastRecurringIncomeUpdated.percentageToApply + lastRecurringIncomeUpdated.reductionPercentage / 2;
                        }

                        incomesData[lastRecurringIncomeIndex].amount = lastRecurringIncomeUpdated.amount * (percentage / 100);
                        incomesCopy = JSON.parse(JSON.stringify(incomesData));

                        // update this income in updatedIncomes
                        let isIncomeUpdated = false;
                        for (let i = 0; i < updatedIncomes.length; i++) {
                            if (updatedIncomes[i].id === lastRecurringIncome.id) {
                                updatedIncomes[i].reductionPercentage = updatedIncomes[i].reductionPercentage / 2;
                                updatedIncomes[i].percentageToApply = percentage;
                                updatedIncomes[i].updated_amount = updatedIncomes[i].amount * (percentage / 100);
                                isIncomeUpdated = true;
                                break;
                            }
                        }

                        [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
                            propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
                            homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
                            currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                            setErrorMessage
                        );
                    }
                }
            }
            // cashflow is still negative so keep increasing income by 50%
            else {

                let firstRecurringIncomeStartDate = new Date(retirementDate);
                let firstRecurringIncome = null;
                let firstRecurringIncomeIndex = -1;
                for (let i = 0; i < incomesData.length; i++) {
                    if (incomesData[i].is_recurring) {
                        if (incomesData[i].end_date) {
                            let incomeStartDate = new Date(incomesData[i].start_date);
                            if (incomeStartDate < firstRecurringIncomeStartDate) {
                                firstRecurringIncomeStartDate = incomeStartDate;
                                firstRecurringIncome = incomesData[i];
                                firstRecurringIncomeIndex = i;
                            }
                        }
                        else {
                            firstRecurringIncomeStartDate = retirementDate;
                            firstRecurringIncome = incomesData[i];
                            firstRecurringIncomeIndex = i;
                        }
                    }
                }

                if (firstRecurringIncome) {
                    // find this income in updatedIncomes
                    const firstRecurringIncomeUpdated = updatedIncomes.find(income => income.id === firstRecurringIncome.id);
                    let percentage = 0;
                    if (firstRecurringIncomeUpdated.percentageToApply === 0) {
                        percentage = 150;
                    }
                    else {
                        percentage = firstRecurringIncomeUpdated.percentageToApply + 50;
                    }

                    incomesData[firstRecurringIncomeIndex].amount = firstRecurringIncomeUpdated.amount * (percentage / 100);
                    incomesCopy = JSON.parse(JSON.stringify(incomesData));

                    // update this income in updatedIncomes
                    for (let i = 0; i < updatedIncomes.length; i++) {
                        if (updatedIncomes[i].id === firstRecurringIncome.id) {
                            updatedIncomes[i].reductionPercentage = 50;
                            updatedIncomes[i].percentageToApply = percentage;
                            updatedIncomes[i].updated_amount = updatedIncomes[i].amount * (percentage / 100);
                            break;
                        }
                    }

                    [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
                        propertiesData, vehiclesData, accountsData, depositsData, incomesCopy, portfoliosData, otherAssetsData,
                        homesData, expensePropertiesData, creditCardDebtsData, personalLoansData, expenseOthersData, dreamsData,
                        currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth,
                        setErrorMessage
                    );

                    // loop through netCashflow and see if each month liquid_assets is positive and set FirstTimePositive to true
                    firstTimePositive = true;
                    for (let i = 0; i < netCashflow.length; i++) {
                        if (netCashflow[i] && parseInt(netCashflow[i].month) === 12 && parseFloat(netCashflow[i].liquid_assets) < 0) {
                            firstTimePositive = false;
                            break;
                        }
                    }
                    if (firstTimePositive) {
                        for (let i = 0; i < updatedIncomes.length; i++) {
                            if (updatedIncomes[i].updated_amount > updatedIncomes[i].original_amount) {
                                updatedIncomes[i].amount = updatedIncomes[i].updated_amount;
                                updatedIncomes[i].reductionPercentage = 0;
                                updatedIncomes[i].percentageToApply = (updatedIncomes[i].updated_amount - updatedIncomes[i].original_amount) / updatedIncomes[i].original_amount * 100;
                            }
                            else {
                                updatedIncomes[i].amount = updatedIncomes[i].updated_amount;
                                updatedIncomes[i].reductionPercentage = 100;
                                updatedIncomes[i].percentageToApply = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}

const Simulate_ReduceIncome = () => {

    const hasFetchedData = useRef(false);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
    }, [currentUserId, currentUserDisplayDummyData, currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth]);

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
                        <CashFlowCommentary netCashflows={cashflowNetData} incomes={updatedIncomesData} isFixedRetirementDate={false} corpus={0} sourcePage={'Simulate_ReduceIncome'} />
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

export default Simulate_ReduceIncome;