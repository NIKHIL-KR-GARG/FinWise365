import { ExchangeRate } from "../common/DefaultValues";
import { isSIPMonth, isSameMonthAndYear } from "../common/DateFunctions";
import { calculateFlatRateInterest }  from "./CalculateInterestAndPrincipal";

export const propertyDreamExpense = (property, date, baseCurrency) => {
    let propertyDreamExpense = 0;
    if (property) {
        // check that it is not in the past
        if (property.purchase_date < date && !isSameMonthAndYear(new Date(property.purchase_date), date)) return 0; 
        // check if we are buying the property now
        if (isSameMonthAndYear(new Date(property.purchase_date), date)) {
            const purchaseValue = parseFloat(property.purchase_price);
            const stampDuty = parseFloat(property.stamp_duty);
            const otherFees = parseFloat(property.other_fees);
            const totalCost = purchaseValue + stampDuty + otherFees;
            if (property.is_funded_by_loan)
                propertyDreamExpense = totalCost - parseFloat(property.loan_amount);
            else
                propertyDreamExpense = totalCost;
        }
        const fromCurrency = property.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        propertyDreamExpense = propertyDreamExpense * conversionRate;
    }
    return propertyDreamExpense;
}

export const vehicleDreamExpense = (vehicle, date, baseCurrency) => {
    let vehicleDreamExpense = 0;
    if (vehicle) {
        // check that it is not in the past
        if (vehicle.purchase_date < date && !isSameMonthAndYear(new Date(vehicle.purchase_date), date)) return 0;
        // check if we are buying the vehicle now
        if (isSameMonthAndYear(new Date(vehicle.purchase_date), date)) {
            const purchaseValue = parseFloat(vehicle.purchase_price);
            if (vehicle.is_funded_by_loan)
                vehicleDreamExpense = purchaseValue - parseFloat(vehicle.loan_amount);
            else
                vehicleDreamExpense = purchaseValue;
        }
        const fromCurrency = vehicle.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        vehicleDreamExpense = vehicleDreamExpense * conversionRate;
    }
    return vehicleDreamExpense;
}

export const educationDreamExpense = (education, date, baseCurrency) => {
    let educationDreamExpense = 0;
    if (education) {
        // check that it is not in the past
        if (education.end_date < date && !isSameMonthAndYear(new Date(education.end_date), date)) return 0;
        if (education.is_funded_by_loan) return 0;
        if ((education.dream_date > date && !isSameMonthAndYear(new Date(education.dream_date), date)) ||
            (education.end_date < date && !isSameMonthAndYear(new Date(education.end_date), date))) return 0;

        educationDreamExpense = parseFloat(education.amount);
        const fromCurrency = education.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        educationDreamExpense = educationDreamExpense * conversionRate;
    }
    return educationDreamExpense;
}

export const travelDreamExpense = (travel, date, baseCurrency) => {
    let travelDreamExpense = 0;
    if (travel) {
        // check that it is not in the past
        if (travel.dream_date < date && !isSameMonthAndYear(new Date(travel.dream_date), date)) return 0;
        if (travel.is_funded_by_loan) return 0;
        // if (travel.dream_date > date && !isSameMonthAndYear(new Date(travel.dream_date), date)) return 0;
        if (isSameMonthAndYear(new Date(travel.dream_date), date)) {
            travelDreamExpense = parseFloat(travel.amount);
            const fromCurrency = travel.currency;
            const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
            const conversionRate = exchangeRate ? exchangeRate.value : 1;
            travelDreamExpense = travelDreamExpense * conversionRate;
        }
    }
    return travelDreamExpense;
}

export const relocationDreamExpense = (relocation, date, baseCurrency) => {
    let relocationDreamExpense = 0;
    if (relocation) {
        // check that it is not in the past
        if (relocation.dream_date < date && !isSameMonthAndYear(new Date(relocation.dream_date), date)) return 0;
        if (relocation.is_funded_by_loan) return 0;
        // if (relocation.dream_date > date && !isSameMonthAndYear(new Date(relocation.dream_date), date)) return 0;
        if (isSameMonthAndYear(new Date(relocation.dream_date), date)) {
            relocationDreamExpense = parseFloat(relocation.amount);
            const fromCurrency = relocation.currency;
            const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
            const conversionRate = exchangeRate ? exchangeRate.value : 1;
            relocationDreamExpense = relocationDreamExpense * conversionRate;
        }
    }
    return relocationDreamExpense;
}

export const otherDreamExpense = (other, date, baseCurrency) => {
    let otherDreamExpense = 0;
    if (other) {
        // check that it is not in the past
        if (other.dream_date < date && !isSameMonthAndYear(new Date(other.dream_date), date)) return 0;
        if (other.is_funded_by_loan) return 0;
        // if (other.dream_date > date && !isSameMonthAndYear(new Date(other.dream_date), date)) return 0;
        if (isSameMonthAndYear(new Date(other.dream_date), date)) {
            otherDreamExpense = parseFloat(other.amount);
            const fromCurrency = other.currency;
            const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
            const conversionRate = exchangeRate ? exchangeRate.value : 1;
            otherDreamExpense = otherDreamExpense * conversionRate;
        }
    }
    return otherDreamExpense;
}

export const propertyDreamYearlyExpense = (property, baseCurrency) => {
    const dreamsListPropertyLumpsum = [];
    if (property) {
        const fromCurrency = property.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        const purchaseValue = parseFloat(property.purchase_price);
        const stampDuty = parseFloat(property.stamp_duty);
        const otherFees = parseFloat(property.other_fees);
        const totalCost = purchaseValue + stampDuty + otherFees;
        if (property.is_funded_by_loan)
            dreamsListPropertyLumpsum.push({
                amount: totalCost - parseFloat(property.loan_amount) * conversionRate,
                year: new Date(property.purchase_date).getFullYear()
            });
        else
            dreamsListPropertyLumpsum.push({
                amount: totalCost * conversionRate,
                year: new Date(property.purchase_date).getFullYear()
            });
    }
    return dreamsListPropertyLumpsum;
}

export const vehicleDreamYearlyExpense = (vehicle, baseCurrency) => {
    const dreamsListVehicleLumpsum = [];
    if (vehicle) {
        const fromCurrency = vehicle.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        const purchaseValue = parseFloat(vehicle.purchase_price);
        if (vehicle.is_funded_by_loan)
            dreamsListVehicleLumpsum.push({
                amount: purchaseValue - parseFloat(vehicle.loan_amount) * conversionRate,
                year: new Date(vehicle.purchase_date).getFullYear()
            });
        else
            dreamsListVehicleLumpsum.push({
                amount: purchaseValue * conversionRate,
                year: new Date(vehicle.purchase_date).getFullYear()
            });
    }
    return dreamsListVehicleLumpsum;
}

export const accountsDreamYearlyExpense = (account, baseCurrency) => {
    const dreamsListAccountsLumpsum = [];
    if (account) {
        const fromCurrency = account.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        dreamsListAccountsLumpsum.push({
            amount: parseFloat(account.account_balance) * conversionRate,
            year: new Date(account.opening_date).getFullYear()
        });
    }
    return dreamsListAccountsLumpsum;
}

export const depositDreamYearlyExpense = (deposit, baseCurrency) => {
    const dreamsListDepositLumpsum = [];
    if (deposit) {
        const fromCurrency = deposit.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        dreamsListDepositLumpsum.push({
            amount: parseFloat(deposit.amount) * conversionRate,
            year: new Date(deposit.opening_date).getFullYear()
        });
    }
    return dreamsListDepositLumpsum;
}

export const portfolioDreamYearlyExpense = (portfolio, baseCurrency) => {
    const dreamsListPortfolioLumpsum = [];
    if (portfolio) {
        const fromCurrency = portfolio.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        dreamsListPortfolioLumpsum.push({
            amount: parseFloat(portfolio.buying_value) * conversionRate,
            year: new Date(portfolio.buying_date).getFullYear()
        });
    }
    return dreamsListPortfolioLumpsum;
}

export const otherAssetDreamYearlyExpense = (otherAsset, baseCurrency) => {
    const dreamsListOtherAssetLumpsum = [];
    if (otherAsset) {
        const fromCurrency = otherAsset.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        dreamsListOtherAssetLumpsum.push({
            amount: parseFloat(otherAsset.lumpsum_amount) * conversionRate,
            year: new Date(otherAsset.start_date).getFullYear()
        });
    }
    return dreamsListOtherAssetLumpsum;
}

export const otherExpenseDreamYearlyExpense = (otherExpense, baseCurrency) => {
    const dreamsListOtherExpenseLumpsum = [];
    if (otherExpense) {
        const fromCurrency = otherExpense.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        dreamsListOtherExpenseLumpsum.push({
            amount: parseFloat(otherExpense.amount) * conversionRate,
            year: new Date(otherExpense.expense_date).getFullYear()
        });
    }
    return dreamsListOtherExpenseLumpsum;
}

export const dreamsYearlyExpense = (dream, baseCurrency) => {
    let dreamsListLumpsum = [];
    if (dream) {
        const fromCurrency = dream.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        if (!dream.is_funded_by_loan) {
            if (!dream.is_recurring) {
                dreamsListLumpsum.push({
                    amount: parseFloat(dream.amount) * conversionRate,
                    year: new Date(dream.dream_date).getFullYear()
                });
            }
            else {
                let dreamsListRecurring = [];
                const n = dream.duration;
                for (let i = 1; i <= n; i++) {
                    // get new date by adding i months to the dream date
                    const newDate = new Date(dream.dream_date).setMonth(new Date(dream.dream_date).getMonth() + i);
                    // check is this is the correct month to add the recurring amount
                    if (isSIPMonth(new Date(dream.dream_date), new Date(newDate), dream.recurring_frequency)) {
                        dreamsListRecurring.push({
                            amount: parseFloat(dream.recurring_amount) * conversionRate,
                            month: new Date(newDate).getMonth(),
                            year: new Date(newDate).getFullYear()
                        });
                    }
                }
                // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
                dreamsListLumpsum = dreamsListRecurring.reduce((acc, curr) => {
                    const index = acc.findIndex(item => item.year === curr.year);
                    if (index > -1) {
                        acc[index].amount += curr.amount;
                    }
                    else {
                        acc.push({
                            amount: curr.amount,
                            year: curr.year
                        });
                    }
                    return acc;
                }, []);
            }
        }
        else {
            if (!dream.is_recurring) {
                dreamsListLumpsum.push({
                    amount: (parseFloat(dream.amount) - parseFloat(dream.loan_amount)) * conversionRate,
                    year: new Date(dream.dream_date).getFullYear()
                });
            }
            else {
                // calculate the total amount to be paid over the duration
                let n = 0;
                if (dream.recurring_frequency === 'Monthly') n = dream.duration;
                else if (dream.recurring_frequency === 'Quarterly') n = dream.duration / 3;
                else if (dream.recurring_frequency === 'Semi-Annually') n = dream.duration / 6;
                else if (dream.recurring_frequency === 'Annually') n = dream.duration / 12;
                const totalAmount = parseFloat(dream.amount) + parseFloat(dream.recurring_amount) * n;
                const pendingAmount = totalAmount - parseFloat(dream.loan_amount);
                if (pendingAmount > 0) {
                    if (pendingAmount <= parseFloat(dream.amount)) {
                        dreamsListLumpsum.push({
                            amount: pendingAmount * conversionRate,
                            year: new Date(dream.dream_date).getFullYear()
                        });
                    }
                    else {
                        const remainingAmount = pendingAmount - parseFloat(dream.amount);
                        const eachInstallmentAmount = remainingAmount / n;
                        let dreamsListRecurring = [];
                        const duration = dream.duration;
                        for (let i = 1; i <= duration; i++) {
                            // get new date by adding i months to the dream date
                            const newDate = new Date(dream.dream_date).setMonth(new Date(dream.dream_date).getMonth() + i);
                            // check is this is the correct month to add the recurring amount
                            if (isSIPMonth(new Date(dream.dream_date), new Date(newDate), dream.recurring_frequency)) {
                                dreamsListRecurring.push({
                                    amount: eachInstallmentAmount * conversionRate,
                                    month: new Date(newDate).getMonth(),
                                    year: new Date(newDate).getFullYear()
                                });
                            }
                        }
                        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
                        dreamsListLumpsum = dreamsListRecurring.reduce((acc, curr) => {
                            const index = acc.findIndex(item => item.year === curr.year);
                            if (index > -1) {
                                acc[index].amount += curr.amount;
                            }
                            else {
                                acc.push({
                                    amount: curr.amount,
                                    year: curr.year
                                });
                            }
                            return acc;
                        }, []);

                        // add an entry for the dream.amnount
                        const dreamYear = new Date(dream.dream_date).getFullYear();
                        // check if this year exists in the dreamsListLumpsum then add the pending amount to the existing amount else add a new entry
                        const index = dreamsListLumpsum.findIndex(item => item.year === dreamYear);
                        if (index > -1) {
                            dreamsListLumpsum[index].amount += parseFloat(dream.amount) * conversionRate;
                        }
                        else {
                            dreamsListLumpsum.push({
                                amount: parseFloat(dream.amount) * conversionRate,
                                year: dreamYear
                            });
                        }
                    }
                }
                else {
                    dreamsListLumpsum.push({
                        amount: 0,
                        year: new Date(dream.dream_date).getFullYear()
                    });
                }
            }
        }
    }
    return dreamsListLumpsum;
}

export const homeExpenseDreamRecurringExpense = (homeExpense, baseCurrency, expenseEndDate) => {
    let dreamsListHomeExpenseRecurring = [];
    if (homeExpense) {
        const start_date = new Date(homeExpense.start_date);
        let end_date = '';
        if (!homeExpense.end_date) end_date = expenseEndDate;
        else end_date = new Date(homeExpense.end_date);

        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());
        const fromCurrency = homeExpense.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;

        let dreamsListRecurring = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(start_date).setMonth(start_date.getMonth() + i);
            let totalExpense = parseFloat(homeExpense.total_expense);
            if (homeExpense.inflation_rate && homeExpense.inflation_rate> 0) {
                const totalInterest = calculateFlatRateInterest(totalExpense, homeExpense.inflation_rate, i);
                totalExpense += totalInterest;
            }
            dreamsListRecurring.push({
                amount: parseFloat(totalExpense) * conversionRate,
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
         
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListHomeExpenseRecurring
        dreamsListHomeExpenseRecurring = dreamsListRecurring.reduce((acc, curr) => {
            const index = acc.findIndex(item => item.year === curr.year);
            if (index > -1) {
                acc[index].amount += curr.amount;
            }
            else {
                acc.push({
                    amount: curr.amount,
                    year: curr.year
                });
            }
            return acc;
        }, []);
    }
    return dreamsListHomeExpenseRecurring;
}

export const propertyExpenseDreamRecurringExpense = (propertyExpense, baseCurrency, expenseEndDate) => {
    let dreamsListPropertyExpenseRecurring = [];
    if (propertyExpense) {
        const start_date = new Date(propertyExpense.start_date);
        let end_date = '';
        if (!propertyExpense.end_date) end_date = expenseEndDate;
        else end_date = new Date(propertyExpense.end_date);
        
        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());

        const fromCurrency = propertyExpense.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;

        let dreamsListRecurring = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(start_date).setMonth(start_date.getMonth() + i);
            let totalExpense = parseFloat(propertyExpense.total_expense);
            if (propertyExpense.inflation_rate && propertyExpense.inflation_rate> 0) {
                const totalInterest = calculateFlatRateInterest(totalExpense, propertyExpense.inflation_rate, i);
                totalExpense += totalInterest;
            }
            dreamsListRecurring.push({
                amount: parseFloat(totalExpense) * conversionRate,
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListPropertyExpenseRecurring
        dreamsListPropertyExpenseRecurring = dreamsListRecurring.reduce((acc, curr) => {
            const index = acc.findIndex(item => item.year === curr.year);
            if (index > -1) {
                acc[index].amount += curr.amount;
            }
            else {
                acc.push({
                    amount: curr.amount,
                    year: curr.year
                });
            }
            return acc;
        }, []);
    }
    return dreamsListPropertyExpenseRecurring;
}

export const creditCardExpenseDreamRecurringExpense = (creditCardExpense, baseCurrency) => {
    let dreamsListCreditCardExpenseRecurring = [];
    if (creditCardExpense) {
        const start_date = new Date(creditCardExpense.start_date);
        // const end_date = new Date(creditCardExpense.end_date);

        // // calculate the number of months between start date and end date
        // const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());
        const months = creditCardExpense.duration;
        const fromCurrency = creditCardExpense.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;

        let dreamsListRecurring = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(start_date).setMonth(start_date.getMonth() + i);
            let totalExpense = parseFloat(creditCardExpense.emi_amount);
            dreamsListRecurring.push({
                amount: parseFloat(totalExpense) * conversionRate,
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListCreditCardExpenseRecurring
        dreamsListCreditCardExpenseRecurring = dreamsListRecurring.reduce((acc, curr) => {
            const index = acc.findIndex(item => item.year === curr.year);
            if (index > -1) {
                acc[index].amount += curr.amount;
            }
            else {
                acc.push({
                    amount: curr.amount,
                    year: curr.year
                });
            }
            return acc;
        }, []);
    }
    return dreamsListCreditCardExpenseRecurring;
}

export const personalLoanExpenseDreamRecurringExpense = (personalLoanExpense, baseCurrency) => {
    let dreamsListPersonalLoanExpenseRecurring = [];
    if (personalLoanExpense) {
        const start_date = new Date(personalLoanExpense.start_date);
        // const end_date = new Date(personalLoanExpense.end_date);

        // // calculate the number of months between start date and end date
        // const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());
        const months = personalLoanExpense.duration;
        const fromCurrency = personalLoanExpense.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;

        let dreamsListRecurring = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(start_date).setMonth(start_date.getMonth() + i);
            let totalExpense = parseFloat(personalLoanExpense.emi_amount);
            dreamsListRecurring.push({
                amount: parseFloat(totalExpense) * conversionRate,
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListPersonalLoanExpenseRecurring
        dreamsListPersonalLoanExpenseRecurring = dreamsListRecurring.reduce((acc, curr) => {
            const index = acc.findIndex(item => item.year === curr.year);
            if (index > -1) {
                acc[index].amount += curr.amount;
            }
            else {
                acc.push({
                    amount: curr.amount,
                    year: curr.year
                });
            }
            return acc;
        }, []);
    }
    return dreamsListPersonalLoanExpenseRecurring;
}

export const otherExpenseDreamRecurringExpense = (otherExpense, baseCurrency) => {
    let dreamsListOtherExpenseRecurring = [];
    if (otherExpense) {
        if (otherExpense.is_recurring) {
            const duration = otherExpense.duration;
            let dreamsListRecurring = [];
            const fromCurrency = otherExpense.currency;
            const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
            const conversionRate = exchangeRate ? exchangeRate.value : 1;

            for (let i = 1; i <= duration; i++) {
                // get new date by adding i months to the dream date
                const newDate = new Date(otherExpense.expense_date).setMonth(new Date(otherExpense.expense_date).getMonth() + i);
                // check is this is the correct month to add the recurring amount
                if (isSIPMonth(new Date(otherExpense.expense_date), new Date(newDate), otherExpense.recurring_frequency)) {
                    const amount = parseFloat(otherExpense.recurring_amount);
                    const interest = calculateFlatRateInterest(amount, otherExpense.inflation_rate, i);
                    const totalAmount = amount + interest;
                    dreamsListRecurring.push({
                        amount: totalAmount * conversionRate,
                        month: new Date(newDate).getMonth(),
                        year: new Date(newDate).getFullYear()
                    });
                }
            }
            // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
            dreamsListOtherExpenseRecurring = dreamsListRecurring.reduce((acc, curr) => {
                const index = acc.findIndex(item => item.year === curr.year);
                if (index > -1) {
                    acc[index].amount += curr.amount;
                }
                else {
                    acc.push({
                        amount: curr.amount,
                        year: curr.year
                    });
                }
                return acc;
            }, []);
        }
    }
    return dreamsListOtherExpenseRecurring;
}

export const emiDreamProperty = (property, baseCurrency) => {
    let emiDreamPropertyList = [];

    if (property && property.is_funded_by_loan) {
        const startDate = new Date(property.loan_as_of_date);
        
        const n = property.loan_duration;
        const fromCurrency = property.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;

        let dreamsListProperty = [];
        for (let i = 1; i <= n; i++) {
            // get new date by adding i months to the dream date
            const newDate = new Date(startDate).setMonth(new Date(startDate).getMonth() + i);

            dreamsListProperty.push({
                amount: parseFloat(property.emi_amount) * conversionRate,
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
        emiDreamPropertyList = dreamsListProperty.reduce((acc, curr) => {
            const index = acc.findIndex(item => item.year === curr.year);
            if (index > -1) {
                acc[index].amount += curr.amount;
            }
            else {
                acc.push({
                    amount: curr.amount,
                    year: curr.year
                });
            }
            return acc;
        }, []);

       }
    return emiDreamPropertyList;
}

export const emiDreamVehicle = (vehicle, baseCurrency) => {
    let emiDreamVehicleList = [];

    if (vehicle && vehicle.is_funded_by_loan) {
        const startDate = new Date(vehicle.loan_as_of_date);
        
        const n = vehicle.loan_duration;
        const fromCurrency = vehicle.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;

        let dreamsListVehicle = [];
        for (let i = 1; i <= n; i++) {
            // get new date by adding i months to the dream date
            const newDate = new Date(startDate).setMonth(new Date(startDate).getMonth() + i);

            dreamsListVehicle.push({
                amount: parseFloat(vehicle.emi_amount) * conversionRate,
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
        emiDreamVehicleList = dreamsListVehicle.reduce((acc, curr) => {
            const index = acc.findIndex(item => item.year === curr.year);
            if (index > -1) {
                acc[index].amount += curr.amount;
            }
            else {
                acc.push({
                    amount: curr.amount,
                    year: curr.year
                });
            }
            return acc;
        }, []);

       }
    return emiDreamVehicleList;
}

export const emiDream = (dream, baseCurrency) => {
    let emiDreamList = [];

    if (dream && dream.is_funded_by_loan) {
        const start_date = new Date(dream.loan_start_date);

        const months = dream.loan_duration;
        const fromCurrency = dream.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;

        let dreamsList = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(start_date).setMonth(start_date.getMonth() + i);
            dreamsList.push({
                amount: parseFloat(dream.emi_amount) * conversionRate,
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
        emiDreamList = dreamsList.reduce((acc, curr) => {
            const index = acc.findIndex(item => item.year === curr.year);
            if (index > -1) {
                acc[index].amount += curr.amount;
            }
            else {
                acc.push({
                    amount: curr.amount,
                    year: curr.year
                });
            }
            return acc;
        }, []);
    }
    return emiDreamList;
}