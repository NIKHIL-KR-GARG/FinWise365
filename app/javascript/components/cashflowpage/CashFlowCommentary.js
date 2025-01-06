import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration'; 
import StarIcon from '@mui/icons-material/Star';
import { FormatCurrency } from '../common/FormatCurrency';
import '../common/GridHeader.css';
import { formatMonthYear } from '../common/DateFunctions';

const CashFlowCommentary = ({ netCashflows, incomes, sourcePage }) => {

    const hasFetchedData = useRef(false);
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');

    const [commentary, setCommentary] = useState({
        liquid_asset_min: 0,
        liquid_asset_min_year: 0,
        liquid_asset_max: 0,
        liquid_asset_max_year: 0,
        fixed_asset_min: 0,
        fixed_asset_min_year: 0,
        fixed_asset_max: 0,
        fixed_asset_max_year: 0,
        net_worth_min: 0,
        net_worth_min_year: 0,
        net_worth_max: 0,
        net_worth_max_year: 0,
        final_leftover: 0,
        shortfall_max: 0,
        shortfall_year: 0,
        positive_jump_liquid_asset: 0,
        positive_jump_liquid_asset_year: 0,
        negative_jump_liquid_asset: 0,
        negative_jump_liquid_asset_year: 0,
        positive_jump_income: 0,
        positive_jump_income_year: 0,
        negative_jump_income: 0,
        negative_jump_income_year: 0,
        positive_jump_expense: 0,
        positive_jump_expense_year: 0,
        negative_jump_expense: 0,
        negative_jump_expense_year: 0,
        key_message: '',
        top_message: ''
    });

    const roundToTwo = (num) => {
        return Math.round(num * 100) / 100;
    };

    const createCommentary = () => {

        let liquid_asset_min = 0;
        let liquid_asset_min_year = 0;
        let liquid_asset_max = 0;
        let liquid_asset_max_year = 0;
        let fixed_asset_min = 0;
        let fixed_asset_min_year = 0;
        let fixed_asset_max = 0;
        let fixed_asset_max_year = 0;
        let net_worth_min = 0;
        let net_worth_min_year = 0;
        let net_worth_max = 0;
        let net_worth_max_year = 0;
        let final_leftover = 0;
        let shortfall_year = 0;
        let shortfall_max = 0;
        let positive_jump_liquid_asset = 0;
        let positive_jump_liquid_asset_year = 0;
        let negative_jump_liquid_asset = 0;
        let negative_jump_liquid_asset_year = 0;
        let positive_jump_income = 0;
        let positive_jump_income_year = 0;
        let negative_jump_income = 0;
        let negative_jump_income_year = 0;
        let positive_jump_expense = 0;
        let positive_jump_expense_year = 0;
        let negative_jump_expense = 0;
        let negative_jump_expense_year = 0;
        let key_message = '';
        let top_message = '';

        let firstRow = true;
        for (let i = 0; i < netCashflows.length; i++) {
            const netCashFlow = netCashflows[i];
            if (netCashFlow.month === 12) {
                if (firstRow) {
                    liquid_asset_min = roundToTwo(netCashflows[i].liquid_assets);
                    liquid_asset_min_year = netCashflows[i].year;
                    liquid_asset_max = roundToTwo(netCashflows[i].liquid_assets);
                    liquid_asset_max_year = netCashflows[i].year;
                    fixed_asset_min = roundToTwo(netCashflows[i].locked_assets);
                    fixed_asset_min_year = netCashflows[i].year;
                    fixed_asset_max = roundToTwo(netCashflows[i].locked_assets);
                    fixed_asset_max_year = netCashflows[i].year;
                    net_worth_min = roundToTwo(netCashflows[i].net_worth);
                    net_worth_min_year = netCashflows[i].year;
                    net_worth_max = roundToTwo(netCashflows[i].net_worth);
                    net_worth_max_year = netCashflows[i].year;
                    firstRow = false;
                } else {
                    if (netCashflows[i].liquid_assets < liquid_asset_min) {
                        liquid_asset_min = roundToTwo(netCashflows[i].liquid_assets);
                        liquid_asset_min_year = netCashflows[i].year;
                    }
                    if (netCashflows[i].liquid_assets > liquid_asset_max) {
                        liquid_asset_max = roundToTwo(netCashflows[i].liquid_assets);
                        liquid_asset_max_year = netCashflows[i].year;
                    }
                    if (netCashflows[i].locked_assets < fixed_asset_min) {
                        fixed_asset_min = roundToTwo(netCashflows[i].locked_assets);
                        fixed_asset_min_year = netCashflows[i].year;
                    }
                    if (netCashflows[i].locked_assets > fixed_asset_max) {
                        fixed_asset_max = roundToTwo(netCashflows[i].locked_assets);
                        fixed_asset_max_year = netCashflows[i].year;
                    }
                    if (netCashflows[i].net_worth < net_worth_min) {
                        net_worth_min = roundToTwo(netCashflows[i].net_worth);
                        net_worth_min_year = netCashflows[i].year;
                    }
                    if (netCashflows[i].net_worth > net_worth_max) {
                        net_worth_max = roundToTwo(netCashflows[i].net_worth);
                        net_worth_max_year = netCashflows[i].year;
                    }

                    const year = netCashflows[i].year;
                    const lastYearCashFlow = netCashflows.find(
                        (cashflow) =>
                            cashflow.month === 12 &&
                            cashflow.year === year - 1
                    );      

                    if (lastYearCashFlow) {
                        if (netCashflows[i].liquid_assets > lastYearCashFlow.liquid_assets) {
                            const positiveJump = roundToTwo(netCashflows[i].liquid_assets - lastYearCashFlow.liquid_assets);
                            if (positiveJump > positive_jump_liquid_asset) {
                                positive_jump_liquid_asset = positiveJump;
                                positive_jump_liquid_asset_year = netCashflows[i].year;
                            }
                        }
                        else if (netCashflows[i].liquid_assets < lastYearCashFlow.liquid_assets) {
                            const negativeJump = roundToTwo(netCashflows[i].liquid_assets - lastYearCashFlow.liquid_assets);
                            if (negativeJump < negative_jump_liquid_asset) {
                                negative_jump_liquid_asset = negativeJump;
                                negative_jump_liquid_asset_year = netCashflows[i].year;
                            }
                        }
                    }
                }
                final_leftover = roundToTwo(netCashflows[i].liquid_assets);
            }
        }

        // generate the yearly data to calculate the jumps for income, expenses & net_position
        const yearlyData = netCashflows.reduce((acc, curr) => {
            const year = curr.year;
            if (!acc[year]) {
                acc[year] = { income: 0, expense: 0, net_position: 0 };
            }
            acc[year].income += curr.income;
            acc[year].expense += curr.expense;
            acc[year].net_position += curr.net_position;
            return acc;
        }, {});

        const yearlyDataArray = Object.keys(yearlyData).map(year => ({
            year: parseInt(year),
            income: parseFloat(yearlyData[year].income),
            expense: parseFloat(yearlyData[year].expense),
            net_position: parseFloat(yearlyData[year].net_position),
        }));

        for (let i = 1; i < yearlyDataArray.length; i++) {
            if (yearlyDataArray[i].income > yearlyDataArray[i - 1].income) {
                const positiveJump = roundToTwo(yearlyDataArray[i].income - yearlyDataArray[i - 1].income);
                if (positiveJump > positive_jump_income) {
                    positive_jump_income = positiveJump;
                    positive_jump_income_year = yearlyDataArray[i].year;
                }
            }
            else if (yearlyDataArray[i].income < yearlyDataArray[i - 1].income) {
                const negativeJump = roundToTwo(yearlyDataArray[i].income - yearlyDataArray[i - 1].income);
                if (negativeJump < negative_jump_income) {
                    negative_jump_income = negativeJump;
                    negative_jump_income_year = yearlyDataArray[i].year;
                }
            }

            if (yearlyDataArray[i].expense > yearlyDataArray[i - 1].expense) {
                const positiveJump = roundToTwo(yearlyDataArray[i].expense - yearlyDataArray[i - 1].expense);
                if (positiveJump > positive_jump_expense) {
                    positive_jump_expense = positiveJump;
                    positive_jump_expense_year = yearlyDataArray[i].year;
                }
            }
            else if (yearlyDataArray[i].expense < yearlyDataArray[i - 1].expense) {
                const negativeJump = roundToTwo(yearlyDataArray[i].expense - yearlyDataArray[i - 1].expense);
                if (negativeJump < negative_jump_expense) {
                    negative_jump_expense = negativeJump;
                    negative_jump_expense_year = yearlyDataArray[i].year;
                }
            }
        }

        for (let i = 0; i < yearlyDataArray.length; i++) {
            if (yearlyDataArray[i].net_position < 0 && yearlyDataArray[i].net_position < shortfall_max) {
                shortfall_max = roundToTwo(yearlyDataArray[i].net_position);
                shortfall_year = yearlyDataArray[i].year;
            }
        }

        // loop through the incomes and see if the new end dates are lower or higher than the original end dates
        let newDateIsHigher = false;
        let newAmountIsHigher = false;
        let newAmountIsLower = false;
        let isSingleIncome = incomes.length === 1? true: false;

        if (sourcePage === "Simulate_WhenToRetire") {

            top_message = 'We have found an answer to your question - When can you retire? Here are the results';

            if (!isSingleIncome) {
                for (let i = 0; i < incomes.length; i++) {
                    if (new Date(incomes[i].updated_end_date) > new Date(incomes[i].end_date)) {
                        newDateIsHigher = true;
                        break;
                    }
                }
            }
            if (newDateIsHigher) {
                if (isSingleIncome)
                    key_message = 'Unfortunately, your current plan is not able to meet you goals. You will have to move the end date of your income: "' + incomes[0].income_name + '" to a later date: "' + formatMonthYear(new Date(incomes[0].updated_end_date)) + '".';
                else
                    key_message = 'Unfortunately, your current plan is not able to meet you goals. You will have to move the end date of one or more incomes. See below table for the suggested changes.';
            }
            else {
                if (isSingleIncome)
                    key_message = 'Hurray, your current plan is able to meet you goals. In fact, you can bring forward the end date of your income: "' + incomes[0].income_name + '" to an earlier date: "' + formatMonthYear(new Date(incomes[0].updated_end_date)) + '".';
                else
                    key_message = 'Hurray, your current plan is able to meet you goals. In fact, you can bring forward the end date of your incomes. See below table for the suggested changes.';
            }
        }
        else if (sourcePage === "Simulate_ReduceIncome") {

            top_message = 'We have found an answer to your question - How much can you reduce your income? Here are the results';

            for (let i = 0; i < incomes.length; i++) {
                if (incomes[i].updated_amount > incomes[i].original_amount) {
                    newAmountIsHigher = true;
                }
                else if (incomes[i].updated_amount < incomes[i].original_amount) {
                    newAmountIsLower = true;
                }
            }

            if (newAmountIsHigher && newAmountIsLower) {
                key_message = 'Unfortunately, your current plan is not able to meet you goals. You will have to increase one or more incomes. But one or more of your future income can be reduced while still meeting your financial goals. See below table for the suggested changes.';
            }
            else if (newAmountIsHigher) {
                if (isSingleIncome)
                    key_message = 'Unfortunately, your current plan is not able to meet you goals. You will have to increase your income: "' + incomes[0].income_name + '" to a higher amount: "' + FormatCurrency(currentUserBaseCurrency, incomes[0].updated_amount) + '".';
                else
                    key_message = 'Unfortunately, your current plan is not able to meet you goals. You will have to increase one or more incomes. See below table for the suggested changes.';
            }
            else {
                if (isSingleIncome)
                    key_message = 'Hurray, your current plan is able to meet you goals. In fact, you can reduce your income: "' + incomes[0].income_name + '" to a lower amount: "' + FormatCurrency(currentUserBaseCurrency, incomes[0].updated_amount) + '".';
                else
                    key_message = 'Hurray, your current plan is able to meet you goals. In fact, you can reduce one or more incomes. See below table for the suggested changes.';
            }
        }

        // update the state
        setCommentary({
            liquid_asset_min,
            liquid_asset_min_year,
            liquid_asset_max,
            liquid_asset_max_year,
            fixed_asset_min,
            fixed_asset_min_year,
            fixed_asset_max,
            fixed_asset_max_year,
            net_worth_min,
            net_worth_min_year,
            net_worth_max,
            net_worth_max_year,
            final_leftover,
            shortfall_year,
            shortfall_max,
            positive_jump_liquid_asset,
            positive_jump_liquid_asset_year,
            negative_jump_liquid_asset,
            negative_jump_liquid_asset_year,
            positive_jump_income,
            positive_jump_income_year,
            negative_jump_income,
            negative_jump_income_year,
            positive_jump_expense,
            positive_jump_expense_year,
            negative_jump_expense,
            negative_jump_expense_year,
            key_message,
            top_message
        });
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            createCommentary();
            hasFetchedData.current = true;
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'left', mb: 2, color: 'purple' }}>
                <CelebrationIcon sx={{ mr: 1, color: 'purple' }} />
                    {commentary.top_message}
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
                Key Analysis and Insights
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', color: 'blue', textAlign: 'center' }}>
                {commentary.key_message}
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The minimum Liquid Assets you had were&nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.liquid_asset_min)}
                            </Typography> 
                            &nbsp;in the year&nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.liquid_asset_min_year}
                            </Typography> 
                            &nbsp;and the maximum were&nbsp; 
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.liquid_asset_max)}
                            </Typography>
                            &nbsp;in the year&nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.liquid_asset_max_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The minimum Fixed Assets you had were&nbsp; 
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.fixed_asset_min)}
                            </Typography>
                            &nbsp;in the year&nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.fixed_asset_min_year}
                            </Typography> 
                            &nbsp;and the maximum were&nbsp; 
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.fixed_asset_max)}
                            </Typography>
                            &nbsp;in the year&nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.fixed_asset_max_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The minimum Net Worth you had was &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.net_worth_min)}
                            </Typography> 
                            &nbsp;in the year&nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.net_worth_min_year}
                            </Typography> 
                            &nbsp;and the maximum was &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.net_worth_max)}
                            </Typography>
                            &nbsp;in the year&nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.net_worth_max_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            Your final Leftover Liquid Assets were &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.final_leftover)}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            You had a Shortfall of &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.shortfall_max)}
                            </Typography> 
                            &nbsp;in the year &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.shortfall_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The largest positive jump in Liquid Assets was &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.positive_jump_liquid_asset)}
                            </Typography> 
                            &nbsp;in the year &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.positive_jump_liquid_asset_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The largest negative jump in Liquid Assets was &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.negative_jump_liquid_asset)}
                            </Typography> 
                            &nbsp;in the year &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.negative_jump_liquid_asset_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The largest positive jump in Income was &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.positive_jump_income)}
                            </Typography> 
                            &nbsp;in the year &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.positive_jump_income_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The largest negative jump in Income was &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.negative_jump_income)}
                            </Typography> 
                            &nbsp; in the year &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.negative_jump_income_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The largest positive jump in Expenses was &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.positive_jump_expense)}
                            </Typography> 
                            &nbsp;in the year &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.positive_jump_expense_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <>
                            The largest negative jump in Expenses was &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {FormatCurrency(currentUserBaseCurrency, commentary.negative_jump_expense)}
                            </Typography> 
                            &nbsp;in the year &nbsp;
                            <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                                {commentary.negative_jump_expense_year}
                            </Typography>.
                        </>
                    } />
                </ListItem>
            </List>
            <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 2 }}>
                Required changes in Income 
            </Typography>
            {sourcePage === "Simulate_WhenToRetire" && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow className="header-theme">
                                <TableCell style={{ color: 'white' }}>Income Name</TableCell>
                                <TableCell style={{ color: 'white' }}>Income Type</TableCell>
                                <TableCell style={{ color: 'white' }}>Location</TableCell>
                                <TableCell style={{ color: 'white' }}>Currency</TableCell>
                                <TableCell style={{ color: 'white' }}>Amount</TableCell>
                                <TableCell style={{ color: 'white' }}>Start Date</TableCell>
                                <TableCell style={{ color: 'white' }}>Original End Date</TableCell>
                                <TableCell style={{ color: 'white' }}>New End Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {incomes.map((income) => (
                                <TableRow key={income.id}>
                                    <TableCell>{income.income_name}</TableCell>
                                    <TableCell>{income.income_type}</TableCell>
                                    <TableCell>{income.location}</TableCell>
                                    <TableCell>{income.currency}</TableCell>
                                    <TableCell>{FormatCurrency(currentUserBaseCurrency, income.amount)}</TableCell>
                                    <TableCell>{formatMonthYear(new Date(income.start_date))}</TableCell>
                                    <TableCell>{formatMonthYear(new Date(income.end_date))}</TableCell>
                                    <TableCell>{formatMonthYear(new Date(income.updated_end_date))}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {sourcePage === "Simulate_ReduceIncome" && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow className="header-theme">
                                <TableCell style={{ color: 'white' }}>Income Name</TableCell>
                                <TableCell style={{ color: 'white' }}>Income Type</TableCell>
                                <TableCell style={{ color: 'white' }}>Location</TableCell>
                                <TableCell style={{ color: 'white' }}>Currency</TableCell>
                                <TableCell style={{ color: 'white' }}>Start Date</TableCell>
                                <TableCell style={{ color: 'white' }}>End Date</TableCell>
                                <TableCell style={{ color: 'white' }}>Original Amount</TableCell>
                                <TableCell style={{ color: 'white' }}>New Amount</TableCell>
                                <TableCell style={{ color: 'white' }}>% Change</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {incomes.map((income) => (
                                <TableRow key={income.id}>
                                    <TableCell>{income.income_name}</TableCell>
                                    <TableCell>{income.income_type}</TableCell>
                                    <TableCell>{income.location}</TableCell>
                                    <TableCell>{income.currency}</TableCell>
                                    <TableCell>{formatMonthYear(new Date(income.start_date))}</TableCell>
                                    <TableCell>{formatMonthYear(new Date(income.end_date))}</TableCell>
                                    <TableCell>{FormatCurrency(currentUserBaseCurrency, income.original_amount)}</TableCell>
                                    <TableCell>{FormatCurrency(currentUserBaseCurrency, income.updated_amount)}</TableCell>
                                    <TableCell>{roundToTwo(income.percentageToApply)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default CashFlowCommentary;