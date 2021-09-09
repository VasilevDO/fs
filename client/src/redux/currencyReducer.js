import { CURRENCY_GET_CURRENCY, CURRENCY_CHANGE_BASE_CURRENCY, START_PROCESSING, END_PROCESSING } from "./types"

const initialState = {
    currency: {},
    visibleCurrencies: ['EUR', 'RUB', 'BTC', 'USD', 'GBP', 'UAH', 'CHF'],
    baseCurrency: 'RUB',
    processing: []
}

export const currencyReducer = (state = initialState, action) => {
    switch (action.type) {
        case CURRENCY_GET_CURRENCY: {
            const rates = action.payload.rates;
            const base = state.baseCurrency;
            const k = 1 / rates[base];
            for (let key in rates) {
                if (state.visibleCurrencies.includes(key)) {
                    rates[key] = 1 / (rates[key] * k);
                } else {
                    delete rates[key]
                }
            }
            action.payload.base = base;
            action.payload.rates = rates;
            return {
                ...state, currency: action.payload
            }
        }
        case CURRENCY_CHANGE_BASE_CURRENCY: {
            const currency = state.currency;
            const rates = currency.rates;
            const base = action.payload;
            const k = 1 / rates[base];
            for (let key in rates) {
                rates[key] = (rates[key] * k);
            }
            currency.rates = rates;
            return {
                ...state, baseCurrency: action.payload, currency: currency
            }
        }
        case START_PROCESSING: {
            return {
                ...state, processing: state.processing.concat(action.payload)
            }
        }
        case END_PROCESSING: {
            return {
                ...state, processing: state.processing.filter(item => item !== action.payload)
            }
        }
        default: return state
    }
}