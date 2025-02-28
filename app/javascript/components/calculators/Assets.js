import { CalculateInterest, pmt, calculateDepreciationValue, CalculatePrincipal } from "./CalculateInterestAndPrincipal";
import { getExchangeRate } from "../common/ExchangeRate";
import { isSameMonthAndYear } from "../common/DateFunctions";

export const propertyAssetValue = (property, date, baseCurrency) => {
    let propertyAssetValue = 0;
    if (property) {
        if (new Date(property.purchase_date) > date && !isSameMonthAndYear(new Date(property.purchase_date), date)) return 0;
        else if (property.is_plan_to_sell && new Date(property.sale_date) < date && !isSameMonthAndYear(new Date(property.sale_date), date)) return 0;
        if (property.is_plan_to_sell && isSameMonthAndYear(new Date(property.sale_date), date))
            propertyAssetValue = parseFloat(property.sale_amount);
        else {
            const startDate = new Date(property.purchase_date);
            const months = (date.getFullYear() - startDate.getFullYear()) * 12 + (date.getMonth() - startDate.getMonth());
            const interest = CalculateInterest(
                "Fixed",
                "Simple",
                property.growth_rate,
                property.purchase_price,
                months,
                "Annually", // does not matter as it is simple interest without recurring payments
                0,
                "Annually" // does not matter as it is simple interest
            );
            propertyAssetValue = parseFloat(property.purchase_price) + interest;
            // calculate the outstanding mortgage
            if (property.is_funded_by_loan) {
                const mortgageOutstanding = calculateMortgageBalance(property, date);
                propertyAssetValue -= mortgageOutstanding;
            }
        }
        propertyAssetValue = propertyAssetValue * getExchangeRate(property.currency, baseCurrency);
    }
    return propertyAssetValue;
};

export const calculateMortgageBalance = (property, date) => {
    
    var outstandingBalance = parseFloat(property.loan_amount);
    const monthlyRate = parseFloat(property.loan_interest_rate) / 100 / 12;
    const emi = Math.abs(pmt(monthlyRate, parseInt(property.loan_duration), parseFloat(property.loan_amount))); // Use absolute value
    const months = (date.getFullYear() - new Date(property.loan_as_of_date).getFullYear()) * 12 + (date.getMonth() - new Date(property.loan_as_of_date).getMonth());
    for (let month = 1; month < months; month++) {
        const openingBalance = outstandingBalance;
        const interest = outstandingBalance * monthlyRate;
        var principal = 0.0;
        if (emi <= openingBalance) principal = emi - interest;
        else principal = openingBalance;
        outstandingBalance -= principal;
    }
    return parseFloat(outstandingBalance);
}

export const vehicleAssetValue = (vehicle, date, baseCurrency) => {
    let vehicleAssetValue = 0;
    if (vehicle) {
        if (new Date(vehicle.purchase_date) > date && !isSameMonthAndYear(new Date(vehicle.purchase_date), date)) return 0;
        else if (vehicle.is_plan_to_sell && new Date(vehicle.sale_date) < date && !isSameMonthAndYear(new Date(vehicle.sale_date), date)) return 0;
        else if (vehicle.is_plan_to_sell && isSameMonthAndYear(new Date(vehicle.sale_date), date))
            vehicleAssetValue = parseFloat(vehicle.sale_amount);
        else {
            const startDate = new Date(vehicle.purchase_date);
            const months = (date.getFullYear() - startDate.getFullYear()) * 12 + (date.getMonth() - startDate.getMonth());
            const years = months / 12;
            vehicleAssetValue = calculateDepreciationValue(vehicle.purchase_price, vehicle.depreciation_rate, years)

            // calculate the outstanding mortgage
            if (vehicle.is_funded_by_loan) {
                const mortgageOustanding = calculateFlatRateLoanBalance(vehicle, date);
                vehicleAssetValue -= mortgageOustanding;
            }
        }
        vehicleAssetValue = vehicleAssetValue * getExchangeRate(vehicle.currency, baseCurrency);
    }
    return vehicleAssetValue;
};

export const calculateFlatRateLoanBalance = (vehicle, date) => {
    const totalMonths = parseInt(vehicle.loan_duration);
    const monthsPaidSoFar = (date.getFullYear() - new Date(vehicle.loan_as_of_date).getFullYear()) * 12 + (date.getMonth() - new Date(vehicle.loan_as_of_date).getMonth());
    const remainingLoanBalance = parseFloat(vehicle.loan_amount)/totalMonths * (totalMonths - monthsPaidSoFar);    
    return parseFloat(remainingLoanBalance);
}

export const accountAssetValue = (account, date, baseCurrency) => {
    let accountAssetValue = 0;
    if (account) {
        if (account.is_plan_to_close && new Date(account.closure_date) < date && !isSameMonthAndYear(new Date(account.closure_date), date)) return 0;
        if (new Date(account.opening_date) > date && !isSameMonthAndYear(new Date(account.opening_date), date)) return 0;

        // calculat interest on the account and add it to the account balance
        const months = (date.getFullYear() - new Date(account.opening_date).getFullYear()) * 12 + date.getMonth() - new Date(account.opening_date).getMonth();
        const interest = CalculateInterest(
            'Fixed',
            'Simple',
            parseFloat(account.interest_rate),
            parseFloat(account.account_balance),
            months,
            '', // does not matter as it is simple interest
            0,
            '' // does not matter as it is simple interest
        );

        accountAssetValue = (account.account_balance + interest) * getExchangeRate(account.currency, baseCurrency);
    }
    return accountAssetValue;
}

export const depositAssetValue = (deposit, date, baseCurrency) => {
    let depositAssetValue = 0;
    if (deposit) {
        if ((new Date(deposit.maturity_date) < date && !isSameMonthAndYear(new Date(deposit.maturity_date), date)) || 
            (new Date(deposit.opening_date) > date && !isSameMonthAndYear(new Date(deposit.opening_date), date))) return 0;
        
        const months = (date.getFullYear() - new Date(deposit.opening_date).getFullYear()) * 12 + date.getMonth() - new Date(deposit.opening_date).getMonth();
        const interest = CalculateInterest(
            deposit.deposit_type,
            deposit.interest_type,
            deposit.interest_rate,
            deposit.amount || 0,
            months,
            deposit.payment_frequency,
            deposit.payment_amount || 0,
            deposit.compounding_frequency
        );
        const principal = CalculatePrincipal(
            deposit.deposit_type,
            deposit.amount || 0,
            months,
            deposit.payment_frequency,
            deposit.payment_amount || 0
        );
        const totalValue = parseFloat(principal) + parseFloat(interest);
        depositAssetValue = totalValue * getExchangeRate(deposit.currency, baseCurrency);
    }
    return depositAssetValue;
}
    
export const portfolioAssetValue = (portfolio, date, baseCurrency) => {
    let portfolioAssetValue = 0.0;
    if (portfolio) {
        if (new Date(portfolio.buying_date) > date && !isSameMonthAndYear(new Date(portfolio.buying_date), date)) return 0;
        if (portfolio.is_plan_to_sell && new Date(portfolio.sale_date) < date && !isSameMonthAndYear(new Date(portfolio.sale_date), date)) return 0;
        if (portfolio.portfolio_type === "Bonds") {
            if (new Date(portfolio.maturity_date) < date && !isSameMonthAndYear(new Date(portfolio.maturity_date), date)) return 0;
            else portfolioAssetValue = parseFloat(portfolio.buying_value);
        }
        else {
            if (portfolio.is_plan_to_sell && isSameMonthAndYear(new Date(portfolio.sale_date), date)) {
                portfolioAssetValue = parseFloat(portfolio.sale_value);
            }
            else {
                // during cashflow calculations, i might have updated the start_date of the portfolio
                if (portfolio.is_sip && new Date(portfolio.buying_date) > new Date(portfolio.sip_end_date)) {
                    const months = (date.getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + date.getMonth() - new Date(portfolio.buying_date).getMonth();
                    const interest = CalculateInterest(
                        'Fixed',
                        'Compounding',
                        parseFloat(portfolio.growth_rate),
                        parseFloat(portfolio.buying_value),
                        months,
                        portfolio.sip_frequency,
                        0,
                        'Annually'
                        // portfolio.sip_frequency 
                    );
                    portfolioAssetValue = parseFloat(portfolio.buying_value) + parseFloat(interest);
                }
                else {
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
                        'Compounding',
                        parseFloat(portfolio.growth_rate),
                        parseFloat(portfolio.buying_value),
                        monthsFromStartTillDate > 0 ? monthsFromStartTillDate : monthsFromStartTillPaymentEnd,
                        portfolio.is_sip ? portfolio.sip_frequency : 'Annually',
                        parseFloat(portfolio.sip_amount) || 0,
                        'Annually'
                        // portfolio.is_sip ? portfolio.sip_frequency : 'Annually' 
                    )
                    const principal = CalculatePrincipal(
                        portfolio.is_sip ? 'Recurring' : 'Fixed',
                        parseFloat(portfolio.buying_value) || 0,
                        monthsFromStartTillDate > 0 ? monthsFromStartTillDate : monthsFromStartTillPaymentEnd,
                        portfolio.is_sip ? portfolio.sip_frequency : 'Annually',
                        parseFloat(portfolio.sip_amount) || 0
                    );
                    let totalValue = parseFloat(principal) + parseFloat(interest);
                    if (monthsFromPaymentEndToDate > 0) {
                        totalValue += CalculateInterest(
                            'Fixed',
                            'Compounding',
                            parseFloat(portfolio.growth_rate),
                            totalValue || 0,
                            monthsFromPaymentEndToDate,
                            portfolio.is_sip ? portfolio.sip_frequency : 'Annually',
                            0,
                            'Annually'
                            // portfolio.is_sip ? portfolio.sip_frequency : 'Annually'
                        );
                    }
                    portfolioAssetValue = totalValue;
                }
            }
        }
        portfolioAssetValue = portfolioAssetValue * getExchangeRate(portfolio.currency, baseCurrency);
    }
    return portfolioAssetValue;
}

export const otherAssetValue = (other, date, baseCurrency) => {
    let otherAssetValue = 0;
    if (other) {
        if (new Date(other.start_date) > date && !isSameMonthAndYear(new Date(other.start_date), date)) return 0;
        if (other.payout_type === 'Lumpsum' && new Date(other.payout_date) < date && !isSameMonthAndYear(new Date(other.payout_date), date)) return 0;
        // check if payout is already completed based on other.start_date && payout_duration
        const payoutDate = new Date(other.payout_date);
        const payoutDuration = other.payout_duration ? parseInt(other.payout_duration) : 0;
        const payoutEndDate = new Date(payoutDate.setMonth(payoutDate.getMonth() + 1 + payoutDuration));
        if (other.payout_type === 'Recurring' && payoutEndDate < date && !isSameMonthAndYear(payoutEndDate, date)) return 0;

        let monthsFromStartTillDate = 0;
        // let monthsFromStartTillPayoutDate = 0;
        let monthsFromStartTillPaymentEnd = 0;
        let monthsFromPaymentEndToDate = 0;
        // let monthsFromPaymentEndToPayoutDate = 0;
        if (!other.is_recurring_payment || isSameMonthAndYear(new Date(other.start_date), date)) { // either there is no recurring payment or we are in the same month as start date
            if (other.payout_type === 'Lumpsum' && new Date(other.payout_date) >= date)
                monthsFromStartTillDate = (date.getFullYear() - new Date(other.start_date).getFullYear()) * 12 + date.getMonth() - new Date(other.start_date).getMonth();
            else if (other.payout_type === 'Recurring' && new Date(other.payout_date) >= date)
                monthsFromStartTillDate = (date.getFullYear() - new Date(other.start_date).getFullYear()) * 12 + date.getMonth() - new Date(other.start_date).getMonth();
            // else if (other.payout_type === 'Recurring' && new Date(other.payout_date) <= date) {
            //     monthsFromStartTillPayoutDate = (new Date(other.start_date).getFullYear() - new Date(other.payout_date).getFullYear()) * 12 + new Date(other.start_date).getMonth() - new Date(other.payout_date).getMonth();
            // }
        }
        else {
            if (other.payout_type === 'Lumpsum' && new Date(other.payment_end_date) >= date)
                monthsFromStartTillDate = (date.getFullYear() - new Date(other.start_date).getFullYear()) * 12 + date.getMonth() - new Date(other.start_date).getMonth();
            else if (other.payout_type === 'Lumpsum' && new Date(other.payment_end_date) < date) {
                monthsFromStartTillPaymentEnd = (new Date(other.payment_end_date).getFullYear() - new Date(other.start_date).getFullYear()) * 12 + new Date(other.payment_end_date).getMonth() - new Date(other.start_date).getMonth();
                monthsFromPaymentEndToDate = (date.getFullYear() - new Date(other.payment_end_date).getFullYear()) * 12 + date.getMonth() - new Date(other.payment_end_date).getMonth();
            }
            else if (other.payout_type === 'Recurring' && new Date(other.payment_end_date) >= date)
                monthsFromStartTillDate = (date.getFullYear() - new Date(other.start_date).getFullYear()) * 12 + date.getMonth() - new Date(other.start_date).getMonth();
            else if (other.payout_type === 'Recurring' && new Date(other.payment_end_date) < date && new Date(other.payout_date) >= date) {
                monthsFromStartTillPaymentEnd = (new Date(other.payment_end_date).getFullYear() - new Date(other.start_date).getFullYear()) * 12 + new Date(other.payment_end_date).getMonth() - new Date(other.start_date).getMonth();
                monthsFromPaymentEndToDate = (date.getFullYear() - new Date(other.payment_end_date).getFullYear()) * 12 + date.getMonth() - new Date(other.payment_end_date).getMonth();
            }
            // else if (other.payout_type === 'Recurring' && new Date(other.payment_end_date) <= date && new Date(other.payout_date) <= date) {
            //     monthsFromStartTillPaymentEnd = (new Date(other.start_date).getFullYear() - new Date(other.payment_end_date).getFullYear()) * 12 + new Date(other.start_date).getMonth() - new Date(other.payment_end_date).getMonth();
            //     monthsFromPaymentEndToPayoutDate = (new Date(other.payout_date).getFullYear() - new Date(other.payment_end_date).getFullYear()) * 12 + new Date(other.payout_date).getMonth() - new Date(other.payment_end_date).getMonth();
        }

        const interest = CalculateInterest(
            other.is_recurring_payment ? 'Recurring' : 'Fixed',
            'Simple',
            other.growth_rate,
            other.lumpsum_amount || 0,
            monthsFromStartTillDate > 0 ? monthsFromStartTillDate : monthsFromStartTillPaymentEnd,
            other.payment_frequency,
            other.payment_amount || 0,
            other.payment_frequency // does not matter as it is simple interest
        );
        const principal = CalculatePrincipal(
            other.is_recurring_payment ? 'Recurring' : 'Fixed',
            other.lumpsum_amount || 0,
            monthsFromStartTillDate > 0 ? monthsFromStartTillDate : monthsFromStartTillPaymentEnd,
            other.payment_frequency,
            other.payment_amount || 0
        );
        let totalValue = parseFloat(principal) + parseFloat(interest);
        // if payment end date is available then calculate the interest and principal for monthsFromPaymentEndToDate
        if (monthsFromPaymentEndToDate > 0) {
            totalValue += CalculateInterest(
                'Fixed',
                'Simple',
                other.growth_rate,
                totalValue || 0,
                monthsFromPaymentEndToDate,
                '', // does not matter as it is simple interest and no further payments
                0,
                '' // does not matter as it is simple interest
            );
        }

        if (other.payout_type === 'Lumpsum')
            otherAssetValue = parseFloat(totalValue);
        else {
            if (new Date(other.payout_date) >= date)
                otherAssetValue = parseFloat(totalValue);
            else {
                // we are already in the payout cycle, so just calculate how many payments are left
                const months = (date.getFullYear() - new Date(other.payout_date).getFullYear()) * 12 + date.getMonth() - new Date(other.payout_date).getMonth();
                let payoutMonthlyValue = 0;
                if (other.payment_frequency === 'Monthly') payoutMonthlyValue = parseFloat(other.payout_value);
                else if (other.payment_frequency === 'Quarterly') payoutMonthlyValue = parseFloat(other.payout_value) / 3;
                else if (other.payment_frequency === 'Semi-Annually') payoutMonthlyValue = parseFloat(other.payout_value) / 6;
                else if (other.payment_frequency === 'Annually') payoutMonthlyValue = parseFloat(other.payout_value) / 12;
                const remainingPayoutValue = payoutMonthlyValue * (parseInt(other.payout_duration) - months);
                otherAssetValue = parseFloat(remainingPayoutValue);
            }
        }
        otherAssetValue = totalValue * getExchangeRate(other.currency, baseCurrency);
    }
    return otherAssetValue;
}

export const incomeAssetValue = (income, date, baseCurrency) => {
    let incomeAssetValue = 0;
    if (income) {
        if ((new Date(income.start_date) > date && !isSameMonthAndYear(new Date(income.start_date), date)) ||
            (income.end_date && new Date(income.end_date) < date && !isSameMonthAndYear(new Date(income.end_date), date))) return 0;
        // check if the start date is this month
        else if (isSameMonthAndYear(new Date(income.start_date), date)) {
            incomeAssetValue = parseFloat(income.amount);
        }
        else {
            // check if this is the correct month for the income
            if (income.is_recurring && isValueMonth(new Date(income.start_date), date, income.income_frequency)) {
                const months = (date.getFullYear() - new Date(income.start_date).getFullYear()) * 12 + date.getMonth() - new Date(income.start_date).getMonth();
                const increment = CalculateInterest(
                    "Fixed",
                    "Compounding",
                    income.growth_rate,
                    income.amount || 0,
                    months,
                    income.income_frequency,
                    0,
                    income.income_frequency // compounding frequency is same as income frequency
                );
                incomeAssetValue = parseFloat(income.amount) + parseFloat(increment);
            }
        }
        incomeAssetValue = incomeAssetValue * getExchangeRate(income.currency, baseCurrency);
    }
    return incomeAssetValue;
}

export const incomePropertyRentalAssetValue = (property, date, baseCurrency) => {
    let incomePropertyRentalAssetValue = 0;
    if (property) {
        if (new Date(property.purchase_date) > date && !isSameMonthAndYear(new Date(property.purchase_date), date)) return 0;
        if (property.is_plan_to_sell && new Date(property.sale_date) < date && !isSameMonthAndYear(new Date(property.sale_date), date)) return 0;
        if (property.is_on_rent && 
                (new Date(property.rental_start_date) <= date) && 
                (!property.rental_end_date || (new Date(property.rental_end_date) >= date))) {
            const months = (date.getFullYear() - new Date(property.rental_start_date).getFullYear()) * 12 + date.getMonth() - new Date(property.rental_start_date).getMonth();
            const increment = CalculateInterest(
                "Fixed",
                "Compounding",
                property.rental_growth_rate,
                property.rental_amount,
                months,
                "Annually", // does not matter as it is Fixed type without recurring payments
                0,
                "Annually" // does not matter as it is simple interest
            );
            const totalValue = parseFloat(property.rental_amount) + parseFloat(increment);
            incomePropertyRentalAssetValue = totalValue * getExchangeRate(property.currency, baseCurrency);
        }        
    }
    return incomePropertyRentalAssetValue;
}

export const incomeCouponAssetValue = (portfolio, date, baseCurrency) => {
    let incomeCouponAssetValue = 0;
    if (portfolio) {
        if (new Date(portfolio.buying_date) > date && !isSameMonthAndYear(new Date(portfolio.buying_date), date)) return 0;
        if (portfolio.is_plan_to_sell && new Date(portfolio.sale_date) < date && !isSameMonthAndYear(new Date(portfolio.sale_date), date)) return 0;
        if (portfolio.portfolio_type === "Bonds") {
            if (new Date(portfolio.maturity_date) < date && !isSameMonthAndYear(new Date(portfolio.maturity_date), date)) return 0;
            else {
                if (isValueMonth(new Date(portfolio.buying_date), date, portfolio.coupon_frequency)) {
                    // calculate the coupon value (coupon is fixed)
                    let couponValue = parseFloat(portfolio.buying_value) * parseFloat(portfolio.coupon_rate) / 100;
                    if (portfolio.coupon_frequency === "Monthly") couponValue = couponValue / 12;
                    else if (portfolio.coupon_frequency === "Quarterly") couponValue = couponValue / 4;
                    else if (portfolio.coupon_frequency === "Semi-Annually") couponValue = couponValue / 2;
                    else if (portfolio.coupon_frequency === "Annually") couponValue = couponValue;
                    incomeCouponAssetValue = couponValue * getExchangeRate(portfolio.currency, baseCurrency);
                }
            }
        }
    }
    return incomeCouponAssetValue;
}

export const incomeDividendAssetValue = (portfolio, date, baseCurrency) => {
    let incomeDividendAssetValue = 0;
    if (portfolio) {
        if (new Date(portfolio.buying_date) > date && !isSameMonthAndYear(new Date(portfolio.buying_date), date)) return 0;
        if (portfolio.is_plan_to_sell && new Date(portfolio.sale_date) < date && !isSameMonthAndYear(new Date(portfolio.sale_date), date)) return 0;
        if (portfolio.is_paying_dividend) {

            // get current portfolio value (this is already converted to base currency)
            const currentPortfolioValue = portfolioAssetValue(portfolio, date, baseCurrency);
            
            if (isValueMonth(new Date(portfolio.buying_date), date, portfolio.dividend_frequency)) {
                // calculate the dividend value
                let dividendValue = parseFloat(currentPortfolioValue) * parseFloat(portfolio.dividend_rate) / 100;
                if (portfolio.dividend_frequency === "Monthly") dividendValue = dividendValue / 12;
                else if (portfolio.dividend_frequency === "Quarterly") dividendValue = dividendValue / 4;
                else if (portfolio.dividend_frequency === "Semi-Annually") dividendValue = dividendValue / 2;
                else if (portfolio.dividend_frequency === "Annually") dividendValue = dividendValue;
                incomeDividendAssetValue = dividendValue;
            }
        }
    }
    return incomeDividendAssetValue;
}

export const isValueMonth = (startDate, currentDate, frequency) => {
    const diffMonths = (new Date(currentDate).getFullYear() - new Date(startDate).getFullYear()) * 12 + (new Date(currentDate).getMonth() - new Date(startDate).getMonth());
    if (frequency === 'Monthly') return true;
    else if (frequency === 'Quarterly' && diffMonths % 3 === 0) return true;
    else if (frequency === 'Semi-Annually' && diffMonths % 6 === 0) return true;
    else if (frequency === 'Annually' && diffMonths % 12 === 0) return true;
    else return false;
}

export const incomePayoutAssetValue = (other, date, baseCurrency) => {
    let incomePayoutAssetValue = 0;
    if (other) {
        if (new Date(other.start_date) > date && !isSameMonthAndYear(new Date(other.start_date), date)) return 0;
        if (other.payout_type === 'Lumpsum') return 0;
        // check if payout is already completed based on other.start_date && payout_duration
        const payoutDate = new Date(other.payout_date);
        const payoutDuration = other.payout_duration ? parseInt(other.payout_duration) : 0;
        const payoutEndDate = new Date(payoutDate.setMonth(payoutDate.getMonth() + 1 + payoutDuration));
        if (payoutEndDate < date && !isSameMonthAndYear(payoutEndDate, date)) return 0;
        
        if (isValueMonth(new Date(other.payout_date), date, other.payout_frequency)) {
            incomePayoutAssetValue = parseFloat(other.payout_value);
            incomePayoutAssetValue = incomePayoutAssetValue * getExchangeRate(other.currency, baseCurrency);
        }
    }
    return incomePayoutAssetValue;
}

export const incomeLeaseAssetValue = (vehicle, date, baseCurrency) => {
    let incomeLeaseAssetValue = 0;
    if (vehicle) {
        if (new Date(vehicle.purchase_date) > date && !isSameMonthAndYear(new Date(vehicle.purchase_date), date)) return 0;
        else if (vehicle.is_plan_to_sell && new Date(vehicle.sale_date) < date && !isSameMonthAndYear(new Date(vehicle.sale_date), date)) return 0;
        else if (!vehicle.is_on_lease) return 0;
        else if (new Date(vehicle.lease_start_date) > date && !isSameMonthAndYear(new Date(vehicle.lease_start_date), date)) return 0;
        else if (vehicle.lease_end_date && new Date(vehicle.lease_end_date) < date && !isSameMonthAndYear(new Date(vehicle.lease_end_date), date)) return 0;
        else {
            const months = (date.getFullYear() - new Date(vehicle.lease_start_date).getFullYear()) * 12 + date.getMonth() - new Date(vehicle.lease_start_date).getMonth();
            const increment = CalculateInterest(
                "Fixed",
                "Compounding",
                vehicle.lease_growth_rate,
                vehicle.lease_amount,
                months,
                "Annually", // does not matter as it is Fixed type without recurring payments
                0,
                "Annually" // does not matter as it is simple interest
            );
            const totalValue = parseFloat(vehicle.lease_amount) + parseFloat(increment);
            incomeLeaseAssetValue = totalValue * getExchangeRate(vehicle.currency, baseCurrency);
        }        
    }
    return incomeLeaseAssetValue;
}