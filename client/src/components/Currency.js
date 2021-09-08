import { connect } from 'react-redux';
import React from 'react';
import { getCurrency, changeBaseCurrency } from '../redux/currencyActions';
import { unixToBeautifulDateWithTime } from './pwnz';
import { CURRENCY_GET_CURRENCY } from '../redux/types';

import refreshPNG from '../assets/buttons/refresh.png';


const Currency = ({ state, user, getCurrency, changeBaseCurrency }) => {

    const dateUpdated = state.currency.timestamp;
    const rates = state.currency.rates || {};
    const baseCurrency = state.baseCurrency;
    const processing = state.processing;

    return (
        <>
            <div className='currency'>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={Object.keys(rates).length}>
                                {dateUpdated ?
                                    <div className='pwnz-f-c'>
                                        <span className='pwnz-f-grow1'>Rates provided: {unixToBeautifulDateWithTime(dateUpdated)}</span>
                                        <div className='pwnz-imgButton pwnz-ml10' onClick={() => getCurrency(user.token)}>
                                            <img className={'pwnz-20x20' + (processing.includes(CURRENCY_GET_CURRENCY) ? ' pwnz-infinitySpin360' : '')} src={refreshPNG} alt='' />
                                        </div>
                                    </div>
                                    : 'Want to know currency rates?'}
                            </th>
                        </tr>
                        <tr>
                            <th colSpan={Object.keys(rates).length}>
                                <div className='pwnz-select pwnz-f-grow1'>
                                    {dateUpdated ?
                                        <select className='pwnz-t-c pwnz-w100 pwnz-mr5' value={baseCurrency} onChange={(e) => changeBaseCurrency(e.target.value)}>
                                            {Object.entries(rates).map(currency => {
                                                if (currency[0] === baseCurrency) {
                                                    return <option value={currency[0]} hidden>{currency[0]}</option>
                                                } else {
                                                    return (
                                                        <option value={currency[0]}>{currency[0]}</option>
                                                    )
                                                }
                                            })}
                                        </select>
                                        :
                                        <div className={'pwnz-button pwnz-w100' + (processing.includes(CURRENCY_GET_CURRENCY) ? ' pwnz-animatedLoading' : '')}>
                                            <div onClick={() => {
                                                if (processing.includes(CURRENCY_GET_CURRENCY)) return;
                                                getCurrency(user.token);
                                            }}>Get rates</div>
                                        </div>
                                    }
                                </div>
                            </th>
                        </tr>
                        <tr>
                            {Object.entries(rates).map(currency => {
                                if (currency[0] === baseCurrency) {
                                    return null;
                                } else {
                                    return (
                                        <th>{currency[0]}</th>
                                    )
                                }
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {Object.entries(rates).map(currency => {
                                if (currency[0] === baseCurrency) {
                                    return null;
                                } else {
                                    return (
                                        <td>{currency[1].toFixed(3) + ' ' + baseCurrency}</td>
                                    )
                                }
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

const mapStateToProps = (state, props) => {
    return {
        user: props.user,
        state: state.currency
    }
}

const mapDispatchToProps = {
    getCurrency,
    changeBaseCurrency
}

export default connect(mapStateToProps, mapDispatchToProps)(Currency);