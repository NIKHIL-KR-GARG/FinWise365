import { CalculateInterest } from "./CalculateInterestAndPrincipal";
import { getExchangeRate } from "../common/ExchangeRate";
import { isSIPMonth, isSameMonthAndYear } from "../common/DateFunctions";

export const homeExpense = (home, date, baseCurrency) => {
    let homeExpense = 0;
    if (home) {
        const startDate = new Date(home.start_date);
        if ((startDate <= date || isSameMonthAndYear(startDate, date)) && 
            (!home.end_date || new Date(home.end_date) >= date || isSameMonthAndYear(new Date(home.end_date), date))) {
            if (home.inflation_rate > 0) {
                const totalInterest = CalculateInterest(
                    "Recurring",
                    "Compounding",
                    home.inflation_rate,
                    parseFloat(home.total_expense),
                    (date.getFullYear() - startDate.getFullYear()) * 12 + (date.getMonth() - startDate.getMonth()),
                    "Annually",
                    0,
                    "Annually"
                );
                homeExpense = home.total_expense + totalInterest;
            }
            else homeExpense = home.total_expense;
        }
    }
    homeExpense = parseFloat(homeExpense) * getExchangeRate(home.currency, baseCurrency);
    return homeExpense;
};

export const propertyExpense = (property, date, baseCurrency) => {
    let propertyExpense = 0;
    if (property) {
        const startDate = new Date(property.start_date);
        if ((startDate <= date || isSameMonthAndYear(startDate, date)) && 
            (!property.end_date || new Date(property.end_date) >= date || isSameMonthAndYear(new Date(property.end_date), date))) {
            if (property.inflation_rate > 0) {
                const totalInterest = CalculateInterest(
                    "Recurring",
                    "Compounding",
                    property.inflation_rate,
                    parseFloat(property.total_expense),
                    (date.getFullYear() - startDate.getFullYear()) * 12 + (date.getMonth() - startDate.getMonth()),
                    "Annually",
                    0,
                    "Annually"
                );
                propertyExpense = property.total_expense + totalInterest;
            }
            else propertyExpense = property.total_expense;
        }
    }
    propertyExpense = parseFloat(propertyExpense) * getExchangeRate(property.currency, baseCurrency);
    return propertyExpense;
};

export const maintananeExpenseProperty = (property, date, baseCurrency) => {
    let maintananeExpenseProperty = 0;
    if (property) {
        if (property.is_under_construction && new Date(property.possession_date) > date && !isSameMonthAndYear(new Date(property.possession_date), date)) return 0;
        else if (property.is_plan_to_sell && new Date(property.sale_date) < date && !isSameMonthAndYear(new Date(property.sale_date), date)) return 0;
        else if (new Date(property.purchase_date) > date && !isSameMonthAndYear(new Date(property.purchase_date), date)) return 0;
        else {
            maintananeExpenseProperty = parseFloat(property.property_maintenance) * getExchangeRate(property.currency, baseCurrency);
        }
    }
    return maintananeExpenseProperty;
}

export const creditCardDebtExpense = (creditCardDebt, date, baseCurrency) => {
    let creditCardDebtExpense = 0;
    if (creditCardDebt) {
        const startDate = new Date(creditCardDebt.start_date);
        const endDate = new Date(creditCardDebt.end_date);
        if ((startDate <= date || isSameMonthAndYear(startDate, date)) && (endDate >= date || isSameMonthAndYear(endDate, date))) {
            creditCardDebtExpense = parseFloat(creditCardDebt.emi_amount) * getExchangeRate(creditCardDebt.currency, baseCurrency);
        }
    }
    return creditCardDebtExpense;
};

export const personalLoanExpense = (personalLoan, date, baseCurrency) => {
    let personalLoanExpense = 0;
    if (personalLoan) {
        const startDate = new Date(personalLoan.start_date);
        const endDate = new Date(personalLoan.end_date);
        if ((startDate <= date || isSameMonthAndYear(startDate, date)) && (endDate >= date || isSameMonthAndYear(endDate, date))) {
            personalLoanExpense = parseFloat(personalLoan.emi_amount) * getExchangeRate(personalLoan.currency, baseCurrency);
        }
    }
    return personalLoanExpense;
};

export const otherExpense = (other, date, baseCurrency) => {
    let otherExpense = 0;
    if (other) {
        const startDate = new Date(other.expense_date);
        // check if the month of expense date same as month of today's date
        if (isSameMonthAndYear(startDate, date)) {
            otherExpense += parseFloat(other.amount);
        }
        else if (startDate >= date) return 0; // if expense date is in future
        else {
            // check if we have a recurring expense and end_date is after today
            if (other.is_recurring & (!other.end_date || new Date(other.end_date) >= date || isSameMonthAndYear(new Date(other.end_date), date))) {
                // check if this the correct month for recurring expense based on recurring_frequency
                const diffMonths = (date.getFullYear() - startDate.getFullYear()) * 12 + (date.getMonth() - startDate.getMonth());
                if (isSIPMonth(startDate, date, other.recurring_frequency)) {
                    otherExpense += parseFloat(other.recurring_amount);
                }
                const totalInterest = CalculateInterest(
                    "Recurring",
                    "Compounding",
                    other.inflation_rate,
                    other.recurring_amount,
                    diffMonths,
                    other.recurring_frequency,
                    0,
                    other.recurring_frequency
                );
                otherExpense += totalInterest;
            }
        }
        otherExpense = otherExpense * getExchangeRate(other.currency, baseCurrency);
    }
    return otherExpense;
};

export const otherExpenseVehicle = (vehicle, date, baseCurrency) => {
    let otherExpenseVehicle = 0;
    if (vehicle) {
        if (vehicle.is_plan_to_sell && new Date(vehicle.sale_date) < date && !isSameMonthAndYear(new Date(vehicle.sale_date), date)) return 0;
        else {
                otherExpenseVehicle = parseFloat(parseFloat(vehicle.vehicle_maintanance) + parseFloat(vehicle.monthly_expenses)) * getExchangeRate(vehicle.currency, baseCurrency);
            }
        }
        return otherExpenseVehicle;
    }

export const emiExpenseProperty = (property, date, baseCurrency) => {
    let emiExpenseProperty = 0;
    if (property) {
        if (property.is_plan_to_sell && new Date(property.sale_date) < date && !isSameMonthAndYear(new Date(property.sale_date), date)) return 0;
        else if (!property.is_funded_by_loan) return 0;
        else {
            const startDate = new Date(property.loan_as_of_date);
            const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1 + parseInt(property.loan_duration)));
            if (endDate < date && !isSameMonthAndYear(endDate, date)) return 0;
            else {
                emiExpenseProperty = parseFloat(property.emi_amount) * getExchangeRate(property.currency, baseCurrency);
            }
        }
    }
    return emiExpenseProperty;
}

export const emiExpenseVehicle = (vehicle, date, baseCurrency) => {
    let emiExpenseVehicle = 0;
    if (vehicle) {
        if (vehicle.is_plan_to_sell && new Date(vehicle.sale_date) < date && !isSameMonthAndYear(new Date(vehicle.sale_date), date)) return 0;
        else if (!vehicle.is_funded_by_loan) return 0;
        else {
            const startDate = new Date(vehicle.loan_as_of_date);
            const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1 + parseInt(vehicle.loan_duration)));
            if (endDate < date && !isSameMonthAndYear(endDate, date)) return 0;
            else {
                emiExpenseVehicle = parseFloat(vehicle.emi_amount) * getExchangeRate(vehicle.currency, baseCurrency);
            }
        }
    }
    return emiExpenseVehicle;
}

export const emiExpenseDream = (dream, date, baseCurrency) => {
    let emiExpenseDream = 0;
    if (dream) {
        if (!dream.is_funded_by_loan) return 0;
        else {
            const startDate = new Date(dream.loan_start_date);
            const endDate = new Date(dream.loan_end_date);
            if ((startDate > date && !isSameMonthAndYear(startDate, date)) ||
                (endDate < date && !isSameMonthAndYear(endDate, date))) return 0;
            else {
                emiExpenseDream = parseFloat(dream.emi_amount) * getExchangeRate(dream.currency, baseCurrency);
            }
        }
    }
    return emiExpenseDream;
}

export const sipExpenseDeposit = (deposit, date, baseCurrency) => {
    let sipExpenseDeposit = 0;
    if (deposit) {
        if (deposit.deposit_type !== 'Recurring') return 0;
        else if (new Date(deposit.maturity_date) < date && !isSameMonthAndYear(new Date(deposit.maturity_date), date)) return 0;
        else {
            // check if this the correct month for sip expense based on frequency
            if (isSIPMonth(new Date(deposit.opening_date), date, deposit.payment_frequency)) {
                sipExpenseDeposit = parseFloat(deposit.payment_amount) * getExchangeRate(deposit.currency, baseCurrency);
            }
        }
    }
    return sipExpenseDeposit;
}

export const sipExpensePortfolio = (portfolio, date, baseCurrency) => {
    let sipExpensePortfolio = 0;
    if (portfolio) {
        if (portfolio.is_plan_to_sell && new Date(portfolio.sale_date) < date && !isSameMonthAndYear(new Date(portfolio.sale_date), date)) return 0;
        else if (!portfolio.is_sip) return 0;
        else {
            // check if this the correct month for sip expense based on frequency
            if (isSIPMonth(new Date(portfolio.buying_date), date, portfolio.sip_frequency)) {
                sipExpensePortfolio = parseFloat(portfolio.sip_amount) * getExchangeRate(portfolio.currency, baseCurrency);
            }
        }
    }
    return sipExpensePortfolio;
}

export const sipExpenseOtherAsset = (otherAsset, date, baseCurrency) => {
    let sipExpenseOtherAsset = 0;
    if (otherAsset) {
        if (!otherAsset.is_recurring_payment) return 0;
        else if (isSameMonthAndYear(new Date(otherAsset.start_date), date)) return 0;
        else if (new Date(otherAsset.payment_end_date) < date && !isSameMonthAndYear(new Date(otherAsset.payment_end_date), date)) return 0;
        else {
            // check if this the correct month for sip expense based on frequency
            if (isSIPMonth(new Date(otherAsset.start_date), date, otherAsset.payment_frequency)) {
                sipExpenseOtherAsset = parseFloat(otherAsset.payment_amount) * getExchangeRate(otherAsset.currency, baseCurrency);
            }
        }
    }
    return sipExpenseOtherAsset;
}

export const taxExpenseProperty = (property, date, baseCurrency) => {
    let taxExpenseProperty = 0;
    if (property) {
        if (property.is_under_construction && new Date(property.possession_date) > date && !isSameMonthAndYear(new Date(property.possession_date), date)) return 0;
        else if (property.is_plan_to_sell && new Date(property.sale_date) < date && !isSameMonthAndYear(new Date(property.sale_date), date)) return 0;
        else if (new Date(property.purchase_date) > date && !isSameMonthAndYear(new Date(property.purchase_date), date)) return 0;
        else {
            taxExpenseProperty = parseFloat(property.property_tax) * getExchangeRate(property.currency, baseCurrency);
        }
    }
    return taxExpenseProperty;
}
