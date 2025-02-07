import { getExchangeRate } from "../common/ExchangeRate";
import { isSIPMonth, isSameMonthAndYear } from "../common/DateFunctions";
import { calculateFlatRateInterest, CalculateInterest }  from "./CalculateInterestAndPrincipal";
import { isValueMonth } from "./Assets";

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
        propertyDreamExpense = propertyDreamExpense * getExchangeRate(property.currency, baseCurrency);
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
        vehicleDreamExpense = vehicleDreamExpense * getExchangeRate(vehicle.currency, baseCurrency);
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
            (education.is_recurring && education.end_date < date && !isSameMonthAndYear(new Date(education.end_date), date))) return 0;

        if (!education.is_recurring && isSameMonthAndYear(new Date(education.dream_date), date)) {
            educationDreamExpense = parseFloat(education.amount);
        }
        else {
            if (isSIPMonth(new Date(education.dream_date), new Date(date), education.recurring_frequency)) {
                educationDreamExpense = parseFloat(education.recurring_amount);
            }
        }
        
        educationDreamExpense = educationDreamExpense * getExchangeRate(education.currency, baseCurrency);
    }
    return educationDreamExpense;
}

export const travelDreamExpense = (travel, date, baseCurrency) => {
    let travelDreamExpense = 0;
    if (travel) {
        // check that it is not in the past
        if (travel.dream_date < date && !isSameMonthAndYear(new Date(travel.dream_date), date)) return 0;
        if (travel.is_funded_by_loan) return 0;
        if ((travel.dream_date > date && !isSameMonthAndYear(new Date(travel.dream_date), date)) ||
            (travel.is_recurring && travel.end_date < date && !isSameMonthAndYear(new Date(travel.end_date), date))) return 0;

        if (!travel.is_recurring && isSameMonthAndYear(new Date(travel.dream_date), date)) {
            travelDreamExpense = parseFloat(travel.amount);
        }
        else {
            if (isSIPMonth(new Date(travel.dream_date), new Date(date), travel.recurring_frequency)) {
                travelDreamExpense = parseFloat(travel.recurring_amount);
            }
        }

        travelDreamExpense = travelDreamExpense * getExchangeRate(travel.currency, baseCurrency);
    }
    return travelDreamExpense;
}

export const relocationDreamExpense = (relocation, date, baseCurrency) => {
    let relocationDreamExpense = 0;
    if (relocation) {
        // check that it is not in the past
        if (relocation.dream_date < date && !isSameMonthAndYear(new Date(relocation.dream_date), date)) return 0;
        if (relocation.is_funded_by_loan) return 0;
        if ((relocation.dream_date > date && !isSameMonthAndYear(new Date(relocation.dream_date), date)) ||
            (relocation.is_recurring && relocation.end_date < date && !isSameMonthAndYear(new Date(relocation.end_date), date))) return 0;

        if (!relocation.is_recurring && isSameMonthAndYear(new Date(relocation.dream_date), date)) {
            relocationDreamExpense = parseFloat(relocation.amount);
        }
        else {
            if (isSIPMonth(new Date(relocation.dream_date), new Date(date), relocation.recurring_frequency)) {
                relocationDreamExpense = parseFloat(relocation.recurring_amount);
            }
        }

        relocationDreamExpense = relocationDreamExpense * getExchangeRate(relocation.currency, baseCurrency);    
    }
    return relocationDreamExpense;
}

export const otherDreamExpense = (other, date, baseCurrency) => {
    let otherDreamExpense = 0;
    if (other) {
        // check that it is not in the past
        if (other.dream_date < date && !isSameMonthAndYear(new Date(other.dream_date), date)) return 0;
        if (other.is_funded_by_loan) return 0;
        if ((other.dream_date > date && !isSameMonthAndYear(new Date(other.dream_date), date)) ||
            (other.is_recurring && other.end_date < date && !isSameMonthAndYear(new Date(other.end_date), date))) return 0;

        if (!other.is_recurring && isSameMonthAndYear(new Date(other.dream_date), date)) {
            otherDreamExpense = parseFloat(other.amount);
        }
        else {
            if (isSIPMonth(new Date(other.dream_date), new Date(date), other.recurring_frequency)) {
                otherDreamExpense = parseFloat(other.recurring_amount);
            }
        }

        otherDreamExpense = otherDreamExpense * getExchangeRate(other.currency, baseCurrency);
    }
    return otherDreamExpense;
}

export const propertyDreamYearlyExpense = (property, baseCurrency) => {
    const dreamsListPropertyLumpsum = [];
    if (property) {
        const purchaseValue = parseFloat(property.purchase_price);
        const stampDuty = parseFloat(property.stamp_duty);
        const otherFees = parseFloat(property.other_fees);
        const totalCost = purchaseValue + stampDuty + otherFees;
        if (property.is_funded_by_loan)
            dreamsListPropertyLumpsum.push({
                amount: totalCost - parseFloat(property.loan_amount) * getExchangeRate(property.currency, baseCurrency),
                year: new Date(property.purchase_date).getFullYear()
            });
        else
            dreamsListPropertyLumpsum.push({
                amount: totalCost * getExchangeRate(property.currency, baseCurrency),
                year: new Date(property.purchase_date).getFullYear()
            });
    }
    return dreamsListPropertyLumpsum;
}

export const vehicleDreamYearlyExpense = (vehicle, baseCurrency) => {
    const dreamsListVehicleLumpsum = [];
    if (vehicle) {
        const purchaseValue = parseFloat(vehicle.purchase_price);
        if (vehicle.is_funded_by_loan)
            dreamsListVehicleLumpsum.push({
                amount: purchaseValue - parseFloat(vehicle.loan_amount) * getExchangeRate(vehicle.currency, baseCurrency),
                year: new Date(vehicle.purchase_date).getFullYear()
            });
        else
            dreamsListVehicleLumpsum.push({
                amount: purchaseValue * getExchangeRate(vehicle.currency, baseCurrency),
                year: new Date(vehicle.purchase_date).getFullYear()
            });
    }
    return dreamsListVehicleLumpsum;
}

export const accountsDreamYearlyExpense = (account, baseCurrency) => {
    const dreamsListAccountsLumpsum = [];
    if (account) {
        dreamsListAccountsLumpsum.push({
            amount: parseFloat(account.account_balance) * getExchangeRate(account.currency, baseCurrency),
            year: new Date(account.opening_date).getFullYear()
        });
    }
    return dreamsListAccountsLumpsum;
}

export const depositDreamYearlyExpense = (deposit, baseCurrency) => {
    const dreamsListDepositLumpsum = [];
    if (deposit) {
        dreamsListDepositLumpsum.push({
            amount: parseFloat(deposit.amount) * getExchangeRate(deposit.currency, baseCurrency),
            year: new Date(deposit.opening_date).getFullYear()
        });
    }
    return dreamsListDepositLumpsum;
}

export const portfolioDreamYearlyExpense = (portfolio, baseCurrency) => {
    const dreamsListPortfolioLumpsum = [];
    if (portfolio) {
        dreamsListPortfolioLumpsum.push({
            amount: parseFloat(portfolio.buying_value) * getExchangeRate(portfolio.currency, baseCurrency),
            year: new Date(portfolio.buying_date).getFullYear()
        });
    }
    return dreamsListPortfolioLumpsum;
}

export const otherAssetDreamYearlyExpense = (otherAsset, baseCurrency) => {
    const dreamsListOtherAssetLumpsum = [];
    if (otherAsset) {
        dreamsListOtherAssetLumpsum.push({
            amount: parseFloat(otherAsset.lumpsum_amount) * getExchangeRate(otherAsset.currency, baseCurrency),
            year: new Date(otherAsset.start_date).getFullYear()
        });
    }
    return dreamsListOtherAssetLumpsum;
}

export const otherExpenseDreamYearlyExpense = (otherExpense, baseCurrency) => {
    const dreamsListOtherExpenseLumpsum = [];
    if (otherExpense) {
        dreamsListOtherExpenseLumpsum.push({
            amount: parseFloat(otherExpense.amount) * getExchangeRate(otherExpense.currency, baseCurrency),
            year: new Date(otherExpense.expense_date).getFullYear()
        });
    }
    return dreamsListOtherExpenseLumpsum;
}

export const dreamsYearlyExpense = (dream, baseCurrency) => {
    let dreamsListLumpsum = [];
    if (dream) {
        if (!dream.is_funded_by_loan) {
            if (!dream.is_recurring) {
                dreamsListLumpsum.push({
                    amount: parseFloat(dream.amount) * getExchangeRate(dream.currency, baseCurrency),
                    year: new Date(dream.dream_date).getFullYear()
                });
            }
            else {
                let dreamsListRecurring = [];
                const n = dream.duration;
                for (let i = 0; i < n; i++) {
                    // get new date by adding i months to the dream date
                    const newDate = new Date(dream.dream_date).setMonth(new Date(dream.dream_date).getMonth() + i);
                    // check is this is the correct month to add the recurring amount
                    if (isSIPMonth(new Date(dream.dream_date), new Date(newDate), dream.recurring_frequency)) {
                        dreamsListRecurring.push({
                            amount: parseFloat(dream.recurring_amount) * getExchangeRate(dream.currency, baseCurrency),
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
                    amount: (parseFloat(dream.amount) - parseFloat(dream.loan_amount)) * getExchangeRate(dream.currency, baseCurrency),
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
                            amount: pendingAmount * getExchangeRate(dream.currency, baseCurrency),
                            year: new Date(dream.dream_date).getFullYear()
                        });
                    }
                    else {
                        const remainingAmount = pendingAmount - parseFloat(dream.amount);
                        const eachInstallmentAmount = remainingAmount / n;
                        let dreamsListRecurring = [];
                        const duration = dream.duration;
                        for (let i = 0; i < duration; i++) {
                            // get new date by adding i months to the dream date
                            const newDate = new Date(dream.dream_date).setMonth(new Date(dream.dream_date).getMonth() + i);
                            // check is this is the correct month to add the recurring amount
                            if (isSIPMonth(new Date(dream.dream_date), new Date(newDate), dream.recurring_frequency)) {
                                dreamsListRecurring.push({
                                    amount: eachInstallmentAmount * getExchangeRate(dream.currency, baseCurrency),
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
                            dreamsListLumpsum[index].amount += parseFloat(dream.amount) * getExchangeRate(dream.currency, baseCurrency);
                        }
                        else {
                            dreamsListLumpsum.push({
                                amount: parseFloat(dream.amount) * getExchangeRate(dream.currency, baseCurrency),
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

        let dreamsListRecurring = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(homeExpense.start_date).setMonth(new Date(homeExpense.start_date).getMonth() + i);
            let totalExpense = parseFloat(homeExpense.total_expense);
            if (homeExpense.inflation_rate && homeExpense.inflation_rate> 0) {
                const totalInterest = calculateFlatRateInterest(totalExpense, homeExpense.inflation_rate, i);
                totalExpense += totalInterest;
            }
            dreamsListRecurring.push({
                amount: parseFloat(totalExpense) * getExchangeRate(homeExpense.currency, baseCurrency),
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

        let dreamsListRecurring = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(propertyExpense.start_date).setMonth(new Date(propertyExpense.start_date).getMonth() + i);
            let totalExpense = parseFloat(propertyExpense.total_expense);
            if (propertyExpense.inflation_rate && propertyExpense.inflation_rate> 0) {
                const totalInterest = calculateFlatRateInterest(totalExpense, propertyExpense.inflation_rate, i);
                totalExpense += totalInterest;
            }
            dreamsListRecurring.push({
                amount: parseFloat(totalExpense) * getExchangeRate(propertyExpense.currency, baseCurrency),
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

        let dreamsListRecurring = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(creditCardExpense.start_date).setMonth(new Date(creditCardExpense.start_date).getMonth() + i);
            let totalExpense = parseFloat(creditCardExpense.emi_amount);
            dreamsListRecurring.push({
                amount: parseFloat(totalExpense) * getExchangeRate(creditCardExpense.currency, baseCurrency),
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

        let dreamsListRecurring = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(personalLoanExpense.start_date).setMonth(new Date(personalLoanExpense.start_date).getMonth() + i);
            let totalExpense = parseFloat(personalLoanExpense.emi_amount);
            dreamsListRecurring.push({
                amount: parseFloat(totalExpense) * getExchangeRate(personalLoanExpense.currency, baseCurrency),
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

            for (let i = 0; i < duration; i++) {
                // get new date by adding i months to the dream date
                const newDate = new Date(otherExpense.expense_date).setMonth(new Date(otherExpense.expense_date).getMonth() + i);
                // check is this is the correct month to add the recurring amount
                if (isSIPMonth(new Date(otherExpense.expense_date), new Date(newDate), otherExpense.recurring_frequency)) {
                    const amount = parseFloat(otherExpense.recurring_amount);
                    const interest = calculateFlatRateInterest(amount, otherExpense.inflation_rate, i);
                    const totalAmount = amount + interest;
                    dreamsListRecurring.push({
                        amount: totalAmount * getExchangeRate(otherExpense.currency, baseCurrency),
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

        let dreamsListProperty = [];
        for (let i = 0; i < n; i++) {
            // get new date by adding i months to the dream date
            const newDate = new Date(property.loan_as_of_date).setMonth(new Date(property.loan_as_of_date).getMonth() + i);

            dreamsListProperty.push({
                amount: parseFloat(property.emi_amount) * getExchangeRate(property.currency, baseCurrency),
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

        let dreamsListVehicle = [];
        for (let i = 0; i < n; i++) {
            // get new date by adding i months to the dream date
            const newDate = new Date(vehicle.loan_as_of_date).setMonth(new Date(vehicle.loan_as_of_date).getMonth() + i);

            dreamsListVehicle.push({
                amount: parseFloat(vehicle.emi_amount) * getExchangeRate(vehicle.currency, baseCurrency),
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
        // const start_date = new Date(dream.loan_start_date);

        const months = dream.loan_duration;

        let dreamsList = [];
        // from start date to end date, for each month add the recurring amount
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(dream.loan_start_date).setMonth(new Date(dream.loan_start_date).getMonth() + i);
            dreamsList.push({
                amount: parseFloat(dream.emi_amount) * getExchangeRate(dream.currency, baseCurrency),
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

export const sipDreamDeposit = (deposit, baseCurrency) => {
    let sipDreamDepositList = [];

    if (deposit) {

        if (deposit.deposit_type !== 'Recurring') return [];

        const start_date = new Date(deposit.opening_date);
        const n = deposit.deposit_term;
        let dreamsListDeposit = [];
        for (let i =0; i < n; i++) {
            // get new date by adding i months to the dream date
            const newDate = new Date(deposit.opening_date).setMonth(new Date(deposit.opening_date).getMonth() + i);

            // check is this is the correct month to add the recurring amount
            if (isSIPMonth(new Date(start_date), new Date(newDate), deposit.payment_frequency)) {
                dreamsListDeposit.push({
                    amount: parseFloat(deposit.payment_amount) * getExchangeRate(deposit.currency, baseCurrency),
                    month: new Date(newDate).getMonth(),
                    year: new Date(newDate).getFullYear()
                });
            }
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
        sipDreamDepositList = dreamsListDeposit.reduce((acc, curr) => {
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
    return sipDreamDepositList;
}

export const sipDreamPortfolio = (portfolio, baseCurrency, sipEndDate) => {
    let sipDreamPortfolioList = [];

    if (portfolio) {

        if (!portfolio.is_sip) return [];

        const start_date = new Date(portfolio.buying_date);

        // derive end date
        let end_date = '';
        if (portfolio.portfolio_type === "Bonds") end_date = new Date(portfolio.maturity_date);
        else if (portfolio.is_plan_to_sell && portfolio.sale_date) end_date = new Date(portfolio.sale_date);
        else if (portfolio.is_sip && portfolio.sip_end_date) end_date = new Date(portfolio.sip_end_date);
        else end_date = new Date(sipEndDate);

        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());

        let dreamsListPortfolio = [];
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the dream date
            const newDate = new Date(portfolio.buying_date).setMonth(new Date(portfolio.buying_date).getMonth() + i);

            // check is this is the correct month to add the recurring amount
            if (isSIPMonth(new Date(start_date), new Date(newDate), portfolio.sip_frequency)) {
                dreamsListPortfolio.push({
                    amount: parseFloat(portfolio.sip_amount) * getExchangeRate(portfolio.currency, baseCurrency),
                    month: new Date(newDate).getMonth(),
                    year: new Date(newDate).getFullYear()
                });
            }
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
        sipDreamPortfolioList = dreamsListPortfolio.reduce((acc, curr) => {
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
    return sipDreamPortfolioList;
}

export const sipDreamOtherAsset = (otherAsset, baseCurrency) => {
    let sipDreamOtherAssetList = [];

    if (otherAsset) {

        if (!otherAsset.is_recurring_payment) return [];

        const start_date = new Date(otherAsset.start_date);
        const end_date = otherAsset.payment_end_date;
        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());

        let dreamsListOtherAsset = [];
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the dream date
            const newDate = new Date(otherAsset.start_date).setMonth(new Date(otherAsset.start_date).getMonth() + i);

            // check is this is the correct month to add the recurring amount
            if (isSIPMonth(new Date(start_date), new Date(newDate), otherAsset.payment_frequency)) {
                dreamsListOtherAsset.push({
                    amount: parseFloat(otherAsset.payment_amount) * getExchangeRate(otherAsset.currency, baseCurrency),
                    month: new Date(newDate).getMonth(),
                    year: new Date(newDate).getFullYear()
                });
            }
        }
        // derive the yearly amount from the dreamsListRecurring and add to the dreamsListLumpsum
        sipDreamOtherAssetList = dreamsListOtherAsset.reduce((acc, curr) => {
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
    return sipDreamOtherAssetList;
}

export const incomeDream = (income, baseCurrency, incomeEndDate) => {
    let incomeDreamList = [];

    if (income) {
        const start_date = new Date(income.start_date);
        // check if this is recurring income
        if (!income.is_recurring) {
            incomeDreamList.push({
                amount: parseFloat(income.amount) * getExchangeRate(income.currency, baseCurrency),
                year: new Date(start_date).getFullYear()
            });
        }
        else
        {
            let end_date = '';
            if (!income.end_date) end_date = incomeEndDate;
            else end_date = new Date(income.end_date);
    
            // calculate the number of months between start date and end date
            const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());
    
            let dreamsListIncome = [];
            for (let i = 0; i < months; i++) {
                // get new date by adding i months to the start date
                const newDate = new Date(income.start_date).setMonth(new Date(income.start_date).getMonth() + i);
                dreamsListIncome.push({
                    amount: parseFloat(income.amount) * getExchangeRate(income.currency, baseCurrency),
                    month: new Date(newDate).getMonth(),
                    year: new Date(newDate).getFullYear()
                });
            }
            // derive the yearly amount from the dreamsListIncome and add to the dreamsListLumpsum
            incomeDreamList = dreamsListIncome.reduce((acc, curr) => {
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
    return incomeDreamList;
}

export const couponIncomeDream = (assetPortfolio, baseCurrency, incomeEndDate) => {
    let couponIncomeDreamList = [];

    if (assetPortfolio) {

        if (assetPortfolio.portfolio_type !== 'Bonds') return [];

        const start_date = new Date(assetPortfolio.buying_date);
        // derive end date
        let end_date = new Date();
        if (assetPortfolio.is_plan_to_sell && assetPortfolio.sale_date) end_date = new Date(assetPortfolio.sale_date);
        else if (assetPortfolio.maturity_date) end_date = new Date(assetPortfolio.maturity_date);
        else end_date = new Date(incomeEndDate);

        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());

        let dreamsListCouponIncome = [];
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(assetPortfolio.buying_date).setMonth(new Date(assetPortfolio.buying_date).getMonth() + i);

            if (isValueMonth(start_date, newDate, assetPortfolio.coupon_frequency)) {
                // calculate the coupon value (coupon is fixed)
                let couponValue = parseFloat(assetPortfolio.buying_value) * parseFloat(assetPortfolio.coupon_rate) / 100;
                if (assetPortfolio.coupon_frequency === "Monthly") couponValue = couponValue / 12;
                else if (assetPortfolio.coupon_frequency === "Quarterly") couponValue = couponValue / 4;
                else if (assetPortfolio.coupon_frequency === "Semi-Annually") couponValue = couponValue / 2;
                else if (assetPortfolio.coupon_frequency === "Annually") couponValue = couponValue;

                dreamsListCouponIncome.push({
                    amount: couponValue * getExchangeRate(assetPortfolio.currency, baseCurrency),
                    month: new Date(newDate).getMonth(),
                    year: new Date(newDate).getFullYear()
                });
            }
        }
        // derive the yearly amount from the dreamsListCouponIncome and add to the couponIncomeDreamList
        couponIncomeDreamList = dreamsListCouponIncome.reduce((acc, curr) => {
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
    return couponIncomeDreamList;
}

const portfolioAssetValue = (portfolio, date) => {
    let portfolioAssetValue = 0.0;
    if (portfolio) {
        let monthsFromStartTillDate = 0;
        let monthsFromStartTillPaymentEnd = 0;
        let monthsFromPaymentEndToDate = 0;
        if (portfolio.is_sip) {
            if (new Date(portfolio.sip_end_date) >= date) {
                monthsFromStartTillDate = (date.getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + date.getMonth() - new Date(portfolio.buying_date).getMonth();
            }
            else {
                monthsFromStartTillPaymentEnd = (new Date(portfolio.sip_end_date).getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + new Date(portfolio.sip_end_date).getMonth() - new Date(portfolio.buying_date).getMonth();
                monthsFromPaymentEndToDate = (date.getFullYear() - new Date(portfolio.sip_end_date).getFullYear()) * 12 + date.getMonth() - new Date(portfolio.sip_end_date).getMonth();
            }
        }
        else {
            monthsFromStartTillDate = (date.getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + date.getMonth() - new Date(portfolio.buying_date).getMonth();
        }

        // calculate the growth based on the growth rate
        const interest = CalculateInterest(
            portfolio.is_sip ? 'Recurring' : 'Fixed',
            'Simple',
            parseFloat(portfolio.growth_rate),
            parseFloat(portfolio.buying_value),
            monthsFromStartTillDate > 0 ? monthsFromStartTillDate : monthsFromStartTillPaymentEnd,
            portfolio.sip_frequency,
            parseFloat(portfolio.sip_amount),
            portfolio.sip_frequency // does not matter as it is simple interest
        )
        const principal = CalculatePrincipal(
            portfolio.is_sip ? 'Recurring' : 'Fixed',
            parseFloat(portfolio.buying_value) || 0,
            monthsFromStartTillDate > 0 ? monthsFromStartTillDate : monthsFromStartTillPaymentEnd,
            portfolio.sip_frequency,
            parseFloat(portfolio.sip_amount) || 0
        );
        let totalValue = parseFloat(principal) + parseFloat(interest);
        if (monthsFromPaymentEndToDate > 0) {
            totalValue += CalculateInterest(
                'Fixed',
                'Simple',
                parseFloat(portfolio.growth_rate),
                totalValue || 0,
                monthsFromPaymentEndToDate,
                '', // does not matter as it is simple interest and no further payments
                0,
                '' // does not matter as it is simple interest
            );
        }
        portfolioAssetValue = totalValue;
    }

    return portfolioAssetValue;
}

export const dividendIncomeDream = (assetPortfolio, baseCurrency, incomeEndDate) => {
    let dividendIncomeDreamList = [];

    if (assetPortfolio) {

        if (!assetPortfolio.is_paying_dividend) return [];

        const start_date = new Date(assetPortfolio.buying_date);
        // derive end date
        let end_date = new Date();
        if (assetPortfolio.is_plan_to_sell && assetPortfolio.sale_date) end_date = new Date(assetPortfolio.sale_date);
        else end_date = new Date(incomeEndDate);

        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());

        let dreamsListDividendIncome = [];
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(assetPortfolio.buying_date).setMonth(new Date(assetPortfolio.buying_date).getMonth() + i);

            // get current portfolio value
            const currentPortfolioValue = portfolioAssetValue(assetPortfolio, newDate);

            if (isValueMonth(start_date, newDate, assetPortfolio.dividend_frequency)) {
                // calculate the dividend value (dividend is fixed)
                let dividendValue = parseFloat(currentPortfolioValue) * parseFloat(assetPortfolio.dividend_rate) / 100;
                if (assetPortfolio.dividend_frequency === "Monthly") dividendValue = dividendValue / 12;
                else if (assetPortfolio.dividend_frequency === "Quarterly") dividendValue = dividendValue / 4;
                else if (assetPortfolio.dividend_frequency === "Semi-Annually") dividendValue = dividendValue / 2;
                else if (assetPortfolio.dividend_frequency === "Annually") dividendValue = dividendValue;

                dreamsListDividendIncome.push({
                    amount: dividendValue * getExchangeRate(assetPortfolio.currency, baseCurrency),
                    month: new Date(newDate).getMonth(),
                    year: new Date(newDate).getFullYear()
                });
            }
        }
        // derive the yearly amount from the dreamsListDividendIncome and add to the dividendIncomeDreamList
        dividendIncomeDreamList = dreamsListDividendIncome.reduce((acc, curr) => {
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
    return dividendIncomeDreamList;
}

export const rentalIncomeDream = (property, baseCurrency, incomeEndDate) => {
    let rentalIncomeDreamList = [];

    if (property) {

        if (!property.is_on_rent) return [];

        const start_date = new Date(property.rental_start_date);
        let end_date = '';
        if (!property.rental_end_date) end_date = incomeEndDate;
        else end_date = new Date(property.rental_end_date);

        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());

        let dreamsListRentalIncome = [];
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(property.rental_start_date).setMonth(new Date(property.rental_start_date).getMonth() + i);

            const increment = CalculateInterest(
                "Fixed",
                "Compounding",
                property.rental_growth_rate,
                property.rental_amount,
                i,
                "Annually", // does not matter as it is Fixed type without recurring payments
                0,
                "Annually" // does not matter as it is simple interest
            );
            const totalValue = parseFloat(property.rental_amount) + parseFloat(increment);

            dreamsListRentalIncome.push({
                amount: totalValue * getExchangeRate(property.currency, baseCurrency),
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
        // derive the yearly amount from the dreamsListRentalIncome and add to the rentalIncomeDreamList
        rentalIncomeDreamList = dreamsListRentalIncome.reduce((acc, curr) => {
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
    return rentalIncomeDreamList;
}

export const leaseIncomeDream = (vehicle, baseCurrency, incomeEndDate) => {
    let leaseIncomeDreamList = [];

    if (vehicle) {

        if (!vehicle.is_on_lease) return [];

        const start_date = new Date(vehicle.lease_start_date);
        let end_date = '';
        if (!vehicle.lease_end_date) end_date = incomeEndDate;
        else end_date = new Date(vehicle.lease_end_date);

        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());

        let dreamsListLeaseIncome = [];
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(vehicle.lease_start_date).setMonth(new Date(vehicle.lease_start_date).getMonth() + i);

            const increment = CalculateInterest(
                "Fixed",
                "Compounding",
                vehicle.lease_growth_rate,
                vehicle.lease_amount,
                i,
                "Annually", // does not matter as it is Fixed type without recurring payments
                0,
                "Annually" // does not matter as it is simple interest
            );
            const totalValue = parseFloat(vehicle.lease_amount) + parseFloat(increment);

            dreamsListLeaseIncome.push({
                amount: totalValue * getExchangeRate(vehicle.currency, baseCurrency),
                month: new Date(newDate).getMonth(),
                year: new Date(newDate).getFullYear()
            });
        }
        // derive the yearly amount from the dreamsListLeaseIncome and add to the leaseIncomeDreamList
        leaseIncomeDreamList = dreamsListLeaseIncome.reduce((acc, curr) => {
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
    return leaseIncomeDreamList;
}

export const payoutIncomeDream = (otherAsset, baseCurrency) => {
    let payoutIncomeDreamList = [];

    if (otherAsset) {

        if (otherAsset.payout_type === 'Lumpsum') return [];

        const start_date = new Date(otherAsset.payout_date);
        const payoutDuration = otherAsset.payout_duration ? parseInt(otherAsset.payout_duration) : 0;
        const end_date = new Date(new Date(otherAsset.payout_date).setMonth(new Date(otherAsset.payout_date).getMonth() + 1 + payoutDuration));

        // calculate the number of months between start date and end date
        const months = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth());

        let dreamsListPayoutIncome = [];
        for (let i = 0; i < months; i++) {
            // get new date by adding i months to the start date
            const newDate = new Date(otherAsset.payout_date).setMonth(new Date(otherAsset.payout_date).getMonth() + i);

            if (isValueMonth(start_date, newDate, otherAsset.payout_frequency)) {
                dreamsListPayoutIncome.push({
                    amount: parseFloat(otherAsset.payout_value) * getExchangeRate(otherAsset.currency, baseCurrency),
                    month: new Date(newDate).getMonth(),
                    year: new Date(newDate).getFullYear()
                });
            }
        }
        // derive the yearly amount from the dreamsListPayoutIncome and add to the payoutIncomeDreamList
        payoutIncomeDreamList = dreamsListPayoutIncome.reduce((acc, curr) => {
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
    return payoutIncomeDreamList;
}