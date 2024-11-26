import { CalculateInterest, pmt, calculateDepreciationValue, CalculatePrincipal } from "./CalculateInterestAndPrincipal";
import { ExchangeRate } from "../common/DefaultValues";

export const propertyAssetValue = (property, date, baseCurrency) => {
    let propertyAssetValue = 0;
    if (property) {
        if (new Date(property.purchase_date) > date) return 0;
        if (property.is_plan_to_sell && (new Date(property.sale_date).getFullYear() === date.getFullYear() && new Date(property.sale_date).getMonth() === date.getMonth()))
            propertyAssetValue = parseFloat(property.sale_value);
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
        const fromCurrency = property.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        propertyAssetValue = propertyAssetValue * conversionRate;
    }
    return propertyAssetValue;
};

const calculateMortgageBalance = (property, date) => {
    
    var outstandingBalance = parseFloat(property.loan_amount);
    const monthlyRate = parseFloat(property.loan_interest_rate) / 100 / 12;
    const emi = Math.abs(pmt(monthlyRate, parseInt(property.loan_duration), parseFloat(property.loan_amount))); // Use absolute value
    const months = (date.getFullYear() - new Date(property.purchase_date).getFullYear()) * 12 + (date.getMonth() - new Date(property.purchase_date).getMonth());
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
        if (new Date(vehicle.purchase_date) > date) return 0;
        else if (vehicle.is_plan_to_sell && (new Date(vehicle.sale_date).getFullYear() === date.getFullYear() && new Date(vehicle.sale_date).getMonth() === date.getMonth()))
            vehicleAssetValue = parseFloat(vehicle.sale_value);
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
        const fromCurrency = vehicle.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        vehicleAssetValue = vehicleAssetValue * conversionRate;
    }
    return vehicleAssetValue;
};

const calculateFlatRateLoanBalance = (vehicle, date) => {
    const totalMonths = parseInt(vehicle.loan_duration);
    const monthsPaidSoFar = (date.getFullYear() - new Date(vehicle.purchase_date).getFullYear()) * 12 + (date.getMonth() - new Date(vehicle.purchase_date).getMonth());
    const remainingLoanBalance = parseFloat(vehicle.loan_amount)/totalMonths * (totalMonths - monthsPaidSoFar);    
    return parseFloat(remainingLoanBalance);
}

export const accountAssetValue = (account, date, baseCurrency) => {
    let accountAssetValue = 0;
    if (account) {
        if (account.is_plan_to_close && new Date(account.closure_date) < date) return 0;
        if (new Date(account.opening_date) > date) return 0;
        const fromCurrency = account.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        accountAssetValue = account.account_balance * conversionRate;
    }
    return accountAssetValue;
}

export const depositAssetValue = (deposit, date, baseCurrency) => {
    let depositAssetValue = 0;
    if (deposit) {
        if (new Date(deposit.maturity_date) < date || new Date(deposit.opening_date) > date) return 0;
        
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
        const fromCurrency = deposit.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        depositAssetValue = totalValue * conversionRate;
    }
    return depositAssetValue;
}
    
export const portfolioAssetValue = (portfolio, date, baseCurrency) => {
    let portfolioAssetValue = 0.0;
    if (portfolio) {
        if (portfolio.is_plan_to_sell && new Date(portfolio.sale_date) < date) return 0;
        if (portfolio.portfolio_type === "Bonds") {
            if (new Date(portfolio.maturity_date) < date) return 0;
            else portfolioAssetValue = parseFloat(portfolio.buying_value);
        }
        else {
            // calculate the growth based on the growth rate
            const months = (date.getFullYear() - new Date(portfolio.buying_date).getFullYear()) * 12 + date.getMonth() - new Date(portfolio.buying_date).getMonth();
            const interest = CalculateInterest(
                'Recurring',
                'Simple',
                parseFloat(portfolio.growth_rate),
                parseFloat(portfolio.buying_value),
                months,
                portfolio.sip_frequency,
                parseFloat(portfolio.sip_amount),
                portfolio.sip_frequency // does not matter as it is simple interest
            )
            const principal = CalculatePrincipal(
                'Recurring',
                parseFloat(portfolio.buying_value) || 0,
                months,
                portfolio.sip_frequency,
                parseFloat(portfolio.sip_amount) || 0
            );
            portfolioAssetValue = parseFloat(principal) + parseFloat(interest);
        }
        const fromCurrency = portfolio.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        portfolioAssetValue = portfolioAssetValue * conversionRate;
    }
    return portfolioAssetValue;
}

export const otherAssetValue = (other, date, baseCurrency) => {
    let otherAssetValue = 0;
    if (other) {
        if (new Date(other.payout_date) < date || new Date(other.start_date) > date) return 0;
        
        const months = (date.getFullYear() - new Date(other.start_date).getFullYear()) * 12 + date.getMonth() - new Date(other.start_date).getMonth();
        const interest = CalculateInterest(
            other.is_recurring_payment? 'Recurring': 'Fixed',
            'Simple',
            other.growth_rate,
            other.lumpsum_amount || 0,
            months,
            other.payment_frequency,
            other.payment_amount || 0,
            other.payment_frequency // does not matter as it is simple interest
        );
        const principal = CalculatePrincipal(
            other.is_recurring_payment? 'Recurring': 'Fixed',
            other.lumpsum_amount || 0,
            months,
            other.payment_frequency,
            other.payment_amount || 0
        );
        const totalValue = parseFloat(principal) + parseFloat(interest);
        const fromCurrency = other.currency;
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === baseCurrency);
        const conversionRate = exchangeRate ? exchangeRate.value : 1;
        otherAssetValue = totalValue * conversionRate;
    }
    return otherAssetValue;
}