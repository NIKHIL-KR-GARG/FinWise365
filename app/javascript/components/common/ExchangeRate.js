// Code to get exchange rate between two currencies
import { ExchangeRate } from './DefaultValues';

export const getExchangeRate = (fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) {
        return 1;
    }
    else {
        const exchangeRate = ExchangeRate.find(rate => rate.from === fromCurrency && rate.to === toCurrency);
        if (exchangeRate) {
            return parseFloat(exchangeRate.value);
        }
        else {
            const reverserExchangeRate = ExchangeRate.find(rate => rate.from === toCurrency && rate.to === fromCurrency);
            if (reverserExchangeRate) {
                return parseFloat(1 / reverserExchangeRate.value);
            }
            else {
                return 1;
            }
        }
    }
}