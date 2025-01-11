import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Snackbar, Alert, IconButton, CircularProgress, Typography, Button, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';
import LockIcon from '@mui/icons-material/Lock';

import { propertyAssetValue, vehicleAssetValue, accountAssetValue, depositAssetValue, portfolioAssetValue, otherAssetValue, incomeAssetValue, incomePropertyRentalAssetValue, incomeCouponAssetValue, incomeDividendAssetValue, incomePayoutAssetValue, incomeLeaseAssetValue } from '../../components/calculators/Assets';
import { homeExpense, propertyExpense, creditCardDebtExpense, personalLoanExpense, otherExpense, emiExpenseProperty, emiExpenseVehicle, emiExpenseDream, sipExpenseDeposit, sipExpensePortfolio, sipExpenseOtherAsset, taxExpenseProperty, maintananeExpenseProperty, otherExpenseVehicle } from '../../components/calculators/Expenses';
import { propertyDreamExpense, vehicleDreamExpense, educationDreamExpense, travelDreamExpense, relocationDreamExpense, otherDreamExpense } from '../../components/calculators/Dreams';

import { getMonthEndDate } from '../../components/common/DateFunctions';
import { GrowthRate } from '../common/DefaultValues';
import AssetsCashflow from '../../components/cashflowpage/AssetsCashflow';
import LiabilitiesCashflow from '../../components/cashflowpage/LiabilitiesCashflow';
import NetCashflow from '../../components/cashflowpage/NetCashflow';

export const fetchAssetLiabilityIncomeData = async (currentUserId, currentUserDisplayDummyData, setLoading, setErrorMessage) => {
    setLoading(true);
    try {
        const [propertiesResponse, vehiclesResponse, accountsResponse,
            depositsResponse, incomesResponse, portfoliosResponse,
            othersResponse, homesResponse, expensePropertiesResponse, creditCardDebtsResponse,
            personalLoansResponse, expenseOthersResponse, dreamsResponse] = await Promise.all([
                axios.get(`/api/asset_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/asset_vehicles?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/asset_accounts?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/asset_deposits?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/asset_incomes?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/asset_portfolios?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/asset_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/expense_homes?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/expense_properties?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/expense_credit_card_debts?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/expense_personal_loans?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/expense_others?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`),
                axios.get(`/api/dreams?user_id=${currentUserId}&is_display_dummy_data=${currentUserDisplayDummyData === 'true'}`)
            ]);

        return {
            properties: propertiesResponse?.data || [],
            vehicles: vehiclesResponse?.data || [],
            accounts: accountsResponse?.data || [],
            deposits: depositsResponse?.data || [],
            incomes: incomesResponse?.data || [],
            portfolios: portfoliosResponse?.data || [],
            otherAssets: othersResponse?.data || [],
            homes: homesResponse?.data || [],
            expenseProperties: expensePropertiesResponse?.data || [],
            creditCardDebts: creditCardDebtsResponse?.data || [],
            personalLoans: personalLoansResponse?.data || [],
            expenseOthers: expenseOthersResponse?.data || [],
            dreams: dreamsResponse?.data || []
        };
    } catch (error) {
        setErrorMessage('Error fetching data');
        return null;
    } finally {
        setLoading(false);
    }
};

export const generateCashflow = (properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets, homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams, currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth, setErrorMessage) => {
    let assetsCashflow = [];
    let liabilitiesCashflow = [];
    let netCashflow = [];

    try {
        if (!currentUserLifeExpectancy || !currentUserCountryOfResidence || isNaN(currentUserDateOfBirth.getTime()) || currentUserDateOfBirth >= new Date()) {
            setErrorMessage('Please set life expectancy, country of residence and date of birth in your profile');
            return [assetsCashflow, liabilitiesCashflow, netCashflow];
        }

        const educations = dreams.filter(dream => dream.dream_type === 'Education') || [];
        const travels = dreams.filter(dream => dream.dream_type === 'Travel') || [];
        const relocations = dreams.filter(dream => dream.dream_type === 'Relocation') || [];
        const otherDreams = dreams.filter(dream => dream.dream_type === 'Other') || [];

        const today = new Date();
        // derive current age
        const dob = new Date(currentUserDateOfBirth);
        const ageDifMs = today - dob;
        let age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);

        let month = today.getMonth() + 1; // Add 1 to get the correct month number
        let year = today.getUTCFullYear();
        const projectionYears = currentUserLifeExpectancy - age;
        const projectionMonths = (projectionYears * 12) + (12 - month + 1);

        let incomeForMonth = 0.0;
        let expenseForMonth = 0.0;
        let netPositionForMonth = 0.0;
        let liquidAssetsForMonth = 0.0;
        let lockedAssetsForMonth = 0.0;
        let netWorthForMonth = 0.0;

        // loop from current month to end month of life expectancy
        for (let i = 0; i < projectionMonths; i++) {
            // derive the month end date for the month and year
            const monthEndDate = getMonthEndDate(month, year);

            incomeForMonth = 0.0;
            expenseForMonth = 0.0;
            netPositionForMonth = 0.0;
            liquidAssetsForMonth = 0.0;
            lockedAssetsForMonth = 0.0;
            netWorthForMonth = 0.0;

            // ----------------- start section for assets cashflow calculation --------------------------

            const defaultGrowthRate = parseFloat(GrowthRate.find((rate) => rate.key === currentUserCountryOfResidence).value || 0);
            let disposableCashAdded = false;
            // check if there is a disposable cash line for previous month
            // if yes, then calculate the growth rate and add the growth to the disposable cash for this month
            const lastMonthDisposableCash = assetsCashflow.find(
                (cashflow) =>
                    cashflow.month === ((month === 1) ? 12 : month - 1) &&
                    cashflow.year === ((month === 1) ? year - 1 : year) &&
                    cashflow.asset_id === -1 &&
                    cashflow.asset_type === 'Disposable Cash'
            );
            if (lastMonthDisposableCash && parseFloat(lastMonthDisposableCash.asset_value) > 0) {
                const disposableCashValue = parseFloat(lastMonthDisposableCash.asset_value) + (parseFloat(lastMonthDisposableCash.asset_value) * (defaultGrowthRate / 100) / 12);
                // add a new line for disposable cash
                assetsCashflow.push({
                    month: month,
                    year: year,
                    age: age,
                    asset_id: -1,
                    asset_type: 'Disposable Cash',
                    asset_name: 'Disposable Cash',
                    original_asset_value: disposableCashValue,
                    asset_value: disposableCashValue,
                    is_locked: false,
                    is_cash: true,
                    is_updated: false,
                    growth_rate: 0.0 // does not matter as we always use the disposable cash value first to handle expenses
                });
                liquidAssetsForMonth += disposableCashValue;
                disposableCashAdded = true;
            }

            // loop through all the incomes lines for last month and add to the disposable cash for this month
            const lastMonthIncomes = assetsCashflow.filter(
                (cashflow) =>
                    cashflow.month === ((month === 1) ? 12 : month - 1) &&
                    cashflow.year === ((month === 1) ? year - 1 : year) &&
                    cashflow.is_cash === true &&
                    cashflow.asset_value > 0 &&
                    cashflow.asset_type !== 'Disposable Cash'
            );
            if (lastMonthIncomes.length > 0) {
                for (let j = 0; j < lastMonthIncomes.length; j++) {
                    const lastMonthIncome = lastMonthIncomes[j];
                    const incomeValue = parseFloat(lastMonthIncome.asset_value) + (parseFloat(lastMonthIncome.asset_value) * (defaultGrowthRate / 100) / 12);
                    if (disposableCashAdded) {
                        // find the disposable cash line for this month and add the income value to it
                        const thisMonthDisposableCash = assetsCashflow.find(
                            (cashflow) =>
                                cashflow.month === month &&
                                cashflow.year === year &&
                                cashflow.asset_id === -1 &&
                                cashflow.asset_type === 'Disposable Cash'
                        );
                        if (thisMonthDisposableCash) {
                            thisMonthDisposableCash.asset_value += incomeValue;
                        }
                    }
                    else {
                        // add a new line for disposable cash
                        assetsCashflow.push({
                            month: month,
                            year: year,
                            age: age,
                            asset_id: -1,
                            asset_type: 'Disposable Cash',
                            asset_name: 'Disposable Cash',
                            original_asset_value: incomeValue,
                            asset_value: incomeValue,
                            is_locked: false,
                            is_cash: true,
                            is_updated: false,
                            growth_rate: 0.0 // does not matter as we always use the disposable cash value first to handle expenses
                        });
                        disposableCashAdded = true;
                    }
                    liquidAssetsForMonth += incomeValue;
                }
            }

            // loop through all the assets and calculate the cashflow for each month
            // get value of all the properties as of this month
            for (let j = 0; j < properties.length; j++) {
                const property = properties[j];
                const assetValue = insertAssetCashflow(assetsCashflow, 'Property', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                lockedAssetsForMonth += assetValue;
            }
            // get value of all the vehicles as of this month
            for (let j = 0; j < vehicles.length; j++) {
                const vehicle = vehicles[j];
                const assetValue = insertAssetCashflow(assetsCashflow, 'Vehicle', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                lockedAssetsForMonth += assetValue;
            }
            // get value of all the accounts as of this month
            for (let j = 0; j < accounts.length; j++) {
                const account = accounts[j];
                const assetValue = insertAssetCashflow(assetsCashflow, 'Account', account, month, year, age, monthEndDate, currentUserBaseCurrency);
                liquidAssetsForMonth += assetValue;
            }
            // get value of all the deposits as of this month
            for (let j = 0; j < deposits.length; j++) {
                const deposit = deposits[j];
                const assetValue = insertAssetCashflow(assetsCashflow, 'Deposit', deposit, month, year, age, monthEndDate, currentUserBaseCurrency);
                liquidAssetsForMonth += assetValue;
            }
            // get value of all the portfolios as of this month
            for (let j = 0; j < portfolios.length; j++) {
                const portfolio = portfolios[j];
                const assetValue = insertAssetCashflow(assetsCashflow, 'Portfolio', portfolio, month, year, age, monthEndDate, currentUserBaseCurrency);
                liquidAssetsForMonth += assetValue;
            }
            // get value of all the other assets as of this month
            for (let j = 0; j < otherAssets.length; j++) {
                const other = otherAssets[j];
                const assetValue = insertAssetCashflow(assetsCashflow, 'Other', other, month, year, age, monthEndDate, currentUserBaseCurrency);
                lockedAssetsForMonth += assetValue;
            }
            // get value of all the incomes as of this month
            for (let j = 0; j < incomes.length; j++) {
                const income = incomes[j];
                const assetValue = insertAssetCashflow(assetsCashflow, 'Income', income, month, year, age, monthEndDate, currentUserBaseCurrency);
                incomeForMonth += assetValue;
            }
            // add rental as income as well
            for (let j = 0; j < properties.length; j++) {
                const property = properties[j];
                if (property.is_on_rent) {
                    const assetValue = insertAssetCashflow(assetsCashflow, 'Rental Income', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                    incomeForMonth += assetValue;
                }
            }
            // add coupon as income as well
            // add dividend as income as well
            for (let j = 0; j < portfolios.length; j++) {
                const portfolio = portfolios[j];
                if (portfolio.portfolio_type === 'Bonds') {
                    const assetValue = insertAssetCashflow(assetsCashflow, 'Coupon Income', portfolio, month, year, age, monthEndDate, currentUserBaseCurrency);
                    incomeForMonth += assetValue;
                }
                else if (portfolio.is_paying_dividend) {
                    const assetValue = insertAssetCashflow(assetsCashflow, 'Dividend Income', portfolio, month, year, age, monthEndDate, currentUserBaseCurrency);
                    incomeForMonth += assetValue;
                }
            }
            // add payout as income as well
            for (let j = 0; j < otherAssets.length; j++) {
                const other = otherAssets[j];
                if (other.payout_type === 'Recurring') {
                    const assetValue = insertAssetCashflow(assetsCashflow, 'Payout Income', other, month, year, age, monthEndDate, currentUserBaseCurrency);
                    incomeForMonth += assetValue;
                }
            }
            // add vehicle lease as income as well
            for (let j = 0; j < vehicles.length; j++) {
                const vehicle = vehicles[j];
                if (vehicle.is_on_lease) {
                    const assetValue = insertAssetCashflow(assetsCashflow, 'Lease Income', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                    incomeForMonth += assetValue;
                }
            }

            // ----------------- end section for assets cashflow calculation ------------------------

            // ----------------- start section for liabilities cashflow calculation -----------------

            // get all the home expenses for the month
            for (let j = 0; j < homes.length; j++) {
                let home = homes[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Home', home, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get all the property expenses for the month
            for (let j = 0; j < expenseProperties.length; j++) {
                let property = expenseProperties[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Property', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // add maintenance from asset properties
            for (let j = 0; j < properties.length; j++) {
                let property = properties[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Property Maintenance', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get all the credit card debts expenses for the month
            for (let j = 0; j < creditCardDebts.length; j++) {
                let creditCardDebt = creditCardDebts[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Credit Card Debt', creditCardDebt, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get all the personal loans expenses for the month
            for (let j = 0; j < personalLoans.length; j++) {
                let personalLoan = personalLoans[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Personal Loan', personalLoan, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get all the other expenses for the month
            for (let j = 0; j < expenseOthers.length; j++) {
                let other = expenseOthers[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Other Expense', other, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // add monthly expense from asset vehicles
            for (let j = 0; j < vehicles.length; j++) {
                let vehicle = vehicles[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Vehicle Expense', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get all the emi expenses for the month
            for (let j = 0; j < vehicles.length; j++) {
                let vehicle = vehicles[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Vehicle EMI', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            for (let j = 0; j < properties.length; j++) {
                let property = properties[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Property EMI', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // add EMI from dreams as well
            for (let j = 0; j < dreams.length; j++) {
                let dream = dreams[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Dream EMI', dream, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get all the sip expenses for the month
            for (let j = 0; j < deposits.length; j++) {
                let deposit = deposits[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Deposit SIP', deposit, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            for (let j = 0; j < portfolios.length; j++) {
                let portfolio = portfolios[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Portfolio SIP', portfolio, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            for (let j = 0; j < otherAssets.length; j++) {
                let other = otherAssets[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Other SIP', other, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get all the tax expenses for the month
            for (let j = 0; j < properties.length; j++) {
                let property = properties[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Property Tax', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }

            // add expenses from the dreams to the expenses cashflow
            // get expenses for buying a property in the future
            for (let j = 0; j < properties.length; j++) {
                let property = properties[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Property Dream', property, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get expenses for buying a vehicle in the future
            for (let j = 0; j < vehicles.length; j++) {
                let vehicle = vehicles[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Vehicle Dream', vehicle, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get expenses for education in the future
            for (let j = 0; j < educations.length; j++) {
                let education = educations[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Education Dream', education, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get expenses for travel in the future
            for (let j = 0; j < travels.length; j++) {
                let travel = travels[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Travel Dream', travel, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get expenses for relocation in the future
            for (let j = 0; j < relocations.length; j++) {
                let relocation = relocations[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Relocation Dream', relocation, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }
            // get expenses for other dreams in the future
            for (let j = 0; j < otherDreams.length; j++) {
                let otherDream = otherDreams[j];
                const expenseValue = insertLiabilityCashflow(liabilitiesCashflow, 'Other Dream', otherDream, month, year, age, monthEndDate, currentUserBaseCurrency);
                expenseForMonth += expenseValue;
            }

            // ----------------- end section for liabilities cashflow calculation -----------------

            // ----------------- start section for net cashflow calculation -----------------
           
            // total expense, total income, Gap, liquid Assets, locked Assets, Net Worth
            netPositionForMonth = parseFloat(incomeForMonth) - parseFloat(expenseForMonth);
            // update liquidAssetsForMonth (could be negative or positive)
            liquidAssetsForMonth += netPositionForMonth;
            // reduce the expenses from the income lines
            const remainingExpense = updateIncomeLinesForExpenses(assetsCashflow, expenseForMonth, month, year);
            if (remainingExpense > 0) {
                // and update the liquid asset lines
                updateLiquidAssetsForExpenses(assetsCashflow, remainingExpense, month, year);
            }

            // find liquidAssetsForLastMonth from netCashflow and add to this month's if it was negative
            const cashflowForLastMonth = netCashflow.find(
                (cashflow) =>
                    cashflow.month === ((month === 1) ? 12 : month - 1) &&
                    cashflow.year === ((month === 1) ? year - 1 : year)
            );
            if (cashflowForLastMonth && cashflowForLastMonth.liquid_assets < 0) {
                liquidAssetsForMonth += cashflowForLastMonth.liquid_assets;
            }

            // update asset classes whereever values has been changed/reduced
            for (let j = 0; j < assetsCashflow.length; j++) {
                const asset = assetsCashflow[j];
                if (asset.is_updated) {
                    if (asset.asset_type === 'Account') {
                        const account = accounts.find(acc => acc.id === asset.asset_id);
                        if (account) {
                            // update value and put start date as this month
                            account.account_balance = asset.asset_value;
                            account.opening_date = monthEndDate;
                        }
                    }
                    else if (asset.asset_type === 'Deposit') {
                        const deposit = deposits.find(dep => dep.id === asset.asset_id);
                        if (deposit) {
                            // close the deposit and move any remaining value to disposable cash
                            deposit.maturity_date = monthEndDate;
                            deposit.amount = 0;

                            if (asset.asset_value > 0) {
                                updateDisposableCashflow(assetsCashflow, month, year, age, parseFloat(asset.asset_value));
                                asset.asset_value = 0;
                            }
                        }
                    }
                    else if (asset.asset_type === 'Portfolio') {
                        const portfolio = portfolios.find(port => port.id === asset.asset_id);
                        if (portfolio) {
                            // update value and put start date as this month
                            portfolio.buying_date = monthEndDate;
                            portfolio.buying_value = asset.asset_value;
                        }
                    }
                }
            }

            netWorthForMonth = parseFloat(liquidAssetsForMonth) + parseFloat(lockedAssetsForMonth);
            // push to net cash flow array
            netCashflow.push({
                month: month,
                year: year,
                age: age,
                income: incomeForMonth,
                expense: expenseForMonth,
                net_position: netPositionForMonth,
                liquid_assets: liquidAssetsForMonth,
                locked_assets: lockedAssetsForMonth,
                net_worth: netWorthForMonth
            });

            // ----------------- end section for net cashflow calculation -----------------

            // check and adjust the year, month and age
            if (month === 12) {
                month = 1;
                year += 1;
                age += 1;
            }
            else month += 1;
        }

        setErrorMessage('');

        return [assetsCashflow, liabilitiesCashflow, netCashflow, false, ''];

    } catch (error) {
        setErrorMessage('Error generating cashflow');
        return [assetsCashflow, liabilitiesCashflow, netCashflow, false, 'Error generating cashflow'];
    }
};

const insertAssetCashflow = (assetsCashflow, asset_type, object, month, year, age, monthEndDate, currentUserBaseCurrency) => {

    let assetValue = 0.0;
    let assetName = '';
    let is_locked = false;
    let is_cash = false;
    let growth_rate = 0.0;

    if (asset_type === 'Property') {
        assetValue = parseFloat(propertyAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = object.property_name;
        is_locked = true;
    }
    else if (asset_type === 'Vehicle') {
        assetValue = parseFloat(vehicleAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = object.vehicle_name;
        is_locked = true;
    }
    else if (asset_type === 'Account') {
        assetValue = parseFloat(accountAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = object.account_name;
        growth_rate = parseFloat(object.interest_rate);
    }
    else if (asset_type === 'Deposit') {
        assetValue = parseFloat(depositAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = object.deposit_name;
        growth_rate = parseFloat(object.interest_rate);
    }
    else if (asset_type === 'Portfolio') {
        assetValue = parseFloat(portfolioAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = object.portfolio_name;
        growth_rate = parseFloat(object.growth_rate);
    }
    else if (asset_type === 'Other') {
        assetValue = parseFloat(otherAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = object.asset_name;
        is_locked = true;
    }
    else if (asset_type === 'Income') {
        assetValue = parseFloat(incomeAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = object.income_name;
        is_cash = true;
    }
    else if (asset_type === 'Rental Income') {
        assetValue = parseFloat(incomePropertyRentalAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = 'Rental Income - ' + object.property_name;
        is_cash = true;
    }
    else if (asset_type === 'Coupon Income') {
        assetValue = parseFloat(incomeCouponAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = 'Coupon Income - ' + object.portfolio_name;
        is_cash = true;
    }
    else if (asset_type === 'Dividend Income') {
        assetValue = parseFloat(incomeDividendAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = 'Dividend Income - ' + object.portfolio_name;
        is_cash = true;
    }
    else if (asset_type === 'Payout Income') {
        assetValue = parseFloat(incomePayoutAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = object.asset_name;
        is_cash = true;
    }
    else if (asset_type === 'Lease Income') {
        assetValue = parseFloat(incomeLeaseAssetValue(object, monthEndDate, currentUserBaseCurrency));
        assetName = 'Lease Income - ' + object.vehicle_name;
        is_cash = true;
    }

    // push to assetsCashflow array
    assetsCashflow.push({
        month: month,
        year: year,
        age: age,
        asset_id: object.id,
        asset_type: asset_type,
        asset_name: assetName,
        original_asset_value: assetValue,
        asset_value: assetValue,
        is_locked: is_locked,
        is_cash: is_cash,
        is_updated: false,
        growth_rate: growth_rate
    });

    // find the last month's cashflow value for this asset
    const lastMonthCashflow = assetsCashflow.find(
        (cashflow) =>
            cashflow.month === ((month === 1) ? 12 : month - 1) &&
            cashflow.year === ((month === 1) ? year - 1 : year) &&
            cashflow.asset_id === object.id &&
            cashflow.asset_type === asset_type
    );

    // check if this asset has been sold or closed in the last month
    // if yes, then add the sale/closure value i.e. last month's cashflow value to disposable cash line
    if (!assetValue || assetValue === 0) {
        if (lastMonthCashflow && parseFloat(lastMonthCashflow.asset_value) > 0) {
            if (!(asset_type === 'Income' || asset_type === 'Rental Income' || asset_type === 'Coupon Income' ||
                asset_type === 'Dividend Income' || asset_type === 'Payout Income' || asset_type === 'Lease Income')) {
                updateDisposableCashflow(assetsCashflow, month, year, age, parseFloat(lastMonthCashflow.asset_value));
            }
        }
    }
    return assetValue;
}

const updateDisposableCashflow = (assetsCashflow, month, year, age, assetValue) => {

    // const defaultGrowthRate = parseFloat(GrowthRate.find((rate) => rate.key === currentUserCountryOfResidence).value || 0);
    // const currentAssetValue = assetValue + (assetValue * (defaultGrowthRate / 100) / 12);
    const currentAssetValue = assetValue;

    const thisMonthDisposableCash = assetsCashflow.find(
        (cashflow) =>
            cashflow.month === month &&
            cashflow.year === year &&
            cashflow.asset_id === -1 &&
            cashflow.asset_type === 'Disposable Cash'
    );
    if (thisMonthDisposableCash) {
        // add the sale value to disposable cash line
        thisMonthDisposableCash.asset_value += parseFloat(currentAssetValue);
    }
    else {
        // add a new line for disposable cash
        assetsCashflow.push({
            month: month,
            year: year,
            age: age,
            asset_id: -1,
            asset_type: 'Disposable Cash',
            asset_name: 'Disposable Cash',
            original_asset_value: parseFloat(currentAssetValue),
            asset_value: parseFloat(currentAssetValue),
            is_locked: false,
            is_cash: true,
            is_updated: false,
            growth_rate: 0.0 // does not matter as we always use the disposable cash value first to handle expenses
        });
    }
}

const insertLiabilityCashflow = (liabilitiesCashflow, liability_type, object, month, year, age, monthEndDate, currentUserBaseCurrency) => {

    let liabilityValue = 0.0;
    let liabilityName = '';

    if (liability_type === 'Home') {
        liabilityValue = parseFloat(homeExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = object.home_name;
    }
    else if (liability_type === 'Property') {
        liabilityValue = parseFloat(propertyExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = object.property_name;
    }
    else if (liability_type === 'Credit Card Debt') {
        liabilityValue = parseFloat(creditCardDebtExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = object.card_name;
    }
    else if (liability_type === 'Personal Loan') {
        liabilityValue = parseFloat(personalLoanExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = object.loan_name;
    }
    else if (liability_type === 'Other Expense') {
        liabilityValue = parseFloat(otherExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = object.expense_name;
    }
    else if (liability_type === 'Property EMI') {
        liabilityValue = parseFloat(emiExpenseProperty(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'EMI - ' + object.property_name;
    }
    else if (liability_type === 'Vehicle EMI') {
        liabilityValue = parseFloat(emiExpenseVehicle(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'EMI - ' + object.vehicle_name;
    }
    else if (liability_type === 'Dream EMI') {
        liabilityValue = parseFloat(emiExpenseDream(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'EMI - ' + object.dream_name;
    }
    else if (liability_type === 'Deposit SIP') {
        liabilityValue = parseFloat(sipExpenseDeposit(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'SIP - ' + object.deposit_name;
    }
    else if (liability_type === 'Portfolio SIP') {
        liabilityValue = parseFloat(sipExpensePortfolio(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'SIP - ' + object.portfolio_name;
    }
    else if (liability_type === 'Other SIP') {
        liabilityValue = parseFloat(sipExpenseOtherAsset(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'SIP - ' + object.asset_name;
    }
    else if (liability_type === 'Property Tax') {
        liabilityValue = parseFloat(taxExpenseProperty(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Tax - ' + object.property_name;
    }
    else if (liability_type === 'Property Maintenance') {
        liabilityValue = parseFloat(maintananeExpenseProperty(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Maintenance - ' + object.property_name;
    }
    else if (liability_type === 'Vehicle Expense') {
        liabilityValue = parseFloat(otherExpenseVehicle(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Vehicle Expense - ' + object.vehicle_name;
    }
    else if (liability_type === 'Vehicle Dream') {
        liabilityValue = parseFloat(vehicleDreamExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Dream Vehicle - ' + object.vehicle_name;
    }
    else if (liability_type === 'Property Dream') {
        liabilityValue = parseFloat(propertyDreamExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Dream Property - ' + object.property_name;
    }
    else if (liability_type === 'Education Dream') {
        liabilityValue = parseFloat(educationDreamExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Dream Education - ' + object.dream_name;
    }
    else if (liability_type === 'Travel Dream') {
        liabilityValue = parseFloat(travelDreamExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Dream Travel - ' + object.dream_name;
    }
    else if (liability_type === 'Relocation Dream') {
        liabilityValue = parseFloat(relocationDreamExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Dream Relocation - ' + object.dream_name;
    }
    else if (liability_type === 'Other Dream') {
        liabilityValue = parseFloat(otherDreamExpense(object, monthEndDate, currentUserBaseCurrency));
        liabilityName = 'Dream Other - ' + object.dream_name;
    }

    // push to liabilitysCashflow array
    liabilitiesCashflow.push({
        month: month,
        year: year,
        age: age,
        liability_id: object.id,
        liability_type: liability_type,
        liability_name: liabilityName,
        liability_value: liabilityValue
    });

    return liabilityValue;
}

const updateIncomeLinesForExpenses = (assetsCashflow, expenseForMonth, month, year) => {
    let remainingExpense = expenseForMonth;
    // find disposable cash line for this month
    const thisMonthDisposableCash = assetsCashflow.find(
        (cashflow) =>
            cashflow.month === month &&
            cashflow.year === year &&
            cashflow.asset_id === -1 &&
            cashflow.asset_type === 'Disposable Cash'
    );
    if (thisMonthDisposableCash && thisMonthDisposableCash.asset_value > 0) {
        if (thisMonthDisposableCash.asset_value > remainingExpense) {
            thisMonthDisposableCash.asset_value -= remainingExpense;
            remainingExpense = 0;
        }
        else {
            remainingExpense -= thisMonthDisposableCash.asset_value;
            thisMonthDisposableCash.asset_value = 0;
        }
    }
    // if there is still some expense left, then reduce it from the income lines
    if (remainingExpense > 0) {
        // find all the income lines for this month
        const incomeLines = assetsCashflow.filter(
            (cashflow) =>
                cashflow.month === month &&
                cashflow.year === year &&
                cashflow.is_cash === true
        );
        if (incomeLines.length > 0) {
            for (let i = 0; i < incomeLines.length; i++) {
                const incomeLine = incomeLines[i];
                if (incomeLine.asset_value > remainingExpense) {
                    incomeLine.asset_value -= remainingExpense;
                    remainingExpense = 0;
                    break;
                }
                else {
                    remainingExpense -= incomeLine.asset_value;
                    incomeLine.asset_value = 0;
                }
            }
        }
    }
    return remainingExpense;
}

const updateLiquidAssetsForExpenses = (assetsCashflow, remainingExpenseForMonth, month, year) => {
    let remainingExpense = remainingExpenseForMonth;
    // find all the liquid assets for this month
    const liquidAssets = assetsCashflow.filter(
        (cashflow) =>
            cashflow.month === month &&
            cashflow.year === year &&
            cashflow.is_locked === false
    ).sort((a, b) => a.growth_rate - b.growth_rate); // sort by growth_rate

    if (liquidAssets.length > 0) {
        for (let i = 0; i < liquidAssets.length; i++) {
            const liquidAsset = liquidAssets[i];
            if (liquidAsset.asset_value > remainingExpense) {
                liquidAsset.asset_value -= remainingExpense;
                liquidAsset.is_updated = true;
                remainingExpense = 0;
                break;
            }
            else {
                remainingExpense -= liquidAsset.asset_value;
                liquidAsset.asset_value = 0;
                liquidAsset.is_updated = true;
            }
        }
    }
    return remainingExpense;
}

const GenerateCashflows = ({ hideAccordians }) => {

    const hasFetchedData = useRef(false);

    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    const currentUserBaseCurrency = localStorage.getItem('currentUserBaseCurrency');
    const currentUserDisplayDummyData = localStorage.getItem('currentUserDisplayDummyData');
    const currentUserLifeExpectancy = parseInt(localStorage.getItem('currentUserLifeExpectancy'));
    const currentUserCountryOfResidence = localStorage.getItem('currentUserCountryOfResidence');
    const currentUserDateOfBirth = new Date(localStorage.getItem('currentUserDateOfBirth'));
    const currentUserIsAdmin = localStorage.getItem('currentUserIsAdmin') === 'true';

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [freezeLoading, setFreezeLoading] = useState(false);
    const [saveAsDummyData, setSaveAsDummyData] = useState(false);

    const [assetsCashflowData, setAssetsCashflowData] = useState([]);
    const [liabilitiesCashflowData, setLiabilitiesCashflowData] = useState([]);
    const [netCashflowData, setNetCashflowData] = useState([]);

    useEffect(() => {
        if (!hasFetchedData.current) {
            const fetchDataAndGenerate = async () => {
                const data = await fetchAssetLiabilityIncomeData(currentUserId, currentUserDisplayDummyData, setLoading, setErrorMessage);
                if (data) {
                    const { properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets, homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams } = data;
                    const [assetsCashflow, liabilitiesCashflow, netCashflow] = generateCashflow(
                        properties, vehicles, accounts, deposits, incomes, portfolios, otherAssets, 
                        homes, expenseProperties, creditCardDebts, personalLoans, expenseOthers, dreams, 
                        currentUserBaseCurrency, currentUserLifeExpectancy, currentUserCountryOfResidence, currentUserDateOfBirth, 
                        setErrorMessage
                    );
                    setAssetsCashflowData(assetsCashflow);
                    setLiabilitiesCashflowData(liabilitiesCashflow);
                    setNetCashflowData(netCashflow);
                }
                setLoading(false);
                hasFetchedData.current = true;
            };

            fetchDataAndGenerate();
        }
    }, []); // Empty dependency array ensures this runs only once

    const handleFreezeCashflow = async () => {
        setFreezeLoading(true);
        try {

            // save a row in cashflow_projections first and retrieve the id
            const cashflowProjection = {
                user_id: currentUserId,
                is_dummy_data: saveAsDummyData,
                cashflow_date: new Date(new Date().toLocaleString()) // Convert local date string back to Date object
            };

            const response = await axios.post('/api/cashflow_projections', cashflowProjection);
            const cashflowProjectionId = response.data.id;

            const cashflowAssets = assetsCashflowData.map(asset => ({
                user_id: currentUserId,
                is_dummy_data: saveAsDummyData,
                cashflow_id: cashflowProjectionId,
                cashflow_date: new Date(new Date().toLocaleString()), // Convert local date string back to Date object
                month: asset.month,
                year: asset.year,
                age: asset.age,
                asset_id: asset.asset_id,
                asset_type: asset.asset_type,
                asset_name: asset.asset_name,
                original_asset_value: asset.original_asset_value,
                asset_value: asset.asset_value,
                is_locked: asset.is_locked,
                is_cash: asset.is_cash,
                growth_rate: asset.growth_rate
            }));

            const cashflowLiabilities = liabilitiesCashflowData.map(liability => ({
                user_id: currentUserId,
                is_dummy_data: saveAsDummyData,
                cashflow_id: cashflowProjectionId,
                cashflow_date: new Date(new Date().toLocaleString()), // Convert local date string back to Date object
                month: liability.month,
                year: liability.year,
                age: liability.age,
                liability_id: liability.liability_id,
                liability_type: liability.liability_type,
                liability_name: liability.liability_name,
                liability_value: liability.liability_value
            }));

            const cashflowNetPositions = netCashflowData.map(net => ({
                user_id: currentUserId,
                is_dummy_data: saveAsDummyData,
                cashflow_id: cashflowProjectionId,
                cashflow_date: new Date(new Date().toLocaleString()), // Convert local date string back to Date object
                month: net.month,
                year: net.year,
                age: net.age,
                income: net.income,
                expense: net.expense,
                net_position: net.net_position,
                liquid_assets: net.liquid_assets,
                locked_assets: net.locked_assets,
                net_worth: net.net_worth
            }));

            await axios.post('/api/cashflow_assets/bulk', { cashflowAssets });
            await axios.post('/api/cashflow_liabilities/bulk', { cashflowLiabilities });
            await axios.post('/api/cashflow_net_positions/bulk', { cashflowNetPositions });

            setSuccessMessage('Cashflow frozen successfully');
        } catch (error) {
            setErrorMessage('Error freezing cashflow');
        } finally {
            setFreezeLoading(false);
        }
    };

    const handleChange = (e) => {
        const { checked } = e.target;
        setSaveAsDummyData(checked);
    };

    return (
        <Box position="relative">
            {(loading || freezeLoading) && (
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
            <Box display="flex" justifyContent="flex-end" mb={2}>
                {currentUserIsAdmin && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={handleChange}
                                name="is_dummy_data"
                            />
                        }
                        label="Is Dummy Data?"
                    />
                )}
                <Tooltip title="Freeze the current cashflow" arrow>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleFreezeCashflow}
                        startIcon={<LockIcon />}
                        sx={{
                            backgroundColor: 'purple',
                            '&:hover': {
                                backgroundColor: 'darkviolet',
                            },
                            minWidth: '150px'
                        }}
                    >
                        Freeze Cashflow
                    </Button>
                </Tooltip>
            </Box>
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
                    <NetCashflow netCashflowData={netCashflowData} />
                </AccordionDetails>
            </Accordion>
            {hideAccordians === false && (
                <>
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
                            <AssetsCashflow assetsCashflowData={assetsCashflowData} />
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
                            <LiabilitiesCashflow liabilitiesCashflowData={liabilitiesCashflowData} />
                        </AccordionDetails>
                    </Accordion>
                </>
            )}
        </Box>
    );
};

export default GenerateCashflows;