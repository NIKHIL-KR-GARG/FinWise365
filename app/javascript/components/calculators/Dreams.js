import { ExchangeRate } from "../common/DefaultValues";
import { isSameMonthAndYear } from "../common/DateFunctions";

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