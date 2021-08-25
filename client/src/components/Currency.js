import { connect } from 'react-redux';
import React, { useState, useRef } from 'react';
import { getCurrency, changeBaseCurrency } from '../redux/currencyActions';
import { Loader } from './Loader';
import { unixToBeautifulDateWithTime } from './pwnz';


const Currency = ({ state, user, loading, getCurrency, changeBaseCurrency }) => {

    if (loading) {
        return (
            <Loader/>
        )
    }

    const dateUpdated = state.currency.timestamp;
    const rates = state.currency.rates || {};
    const baseCurrency = state.baseCurrency;
    return (
        <>
            <div className='currency'>
                <table>
                    <thead>
                        <tr>
                            <th colSpan='3'>
                                {dateUpdated ?
                                    <div className='pwnz-f-c'>
                                        <span> {unixToBeautifulDateWithTime(dateUpdated)}</span>
                                        <div className='pwnz-button pwnz-ml10' >
                                            <div className='pwnz-fs23' onClick={() => getCurrency(user.token)}>🗘</div>
                                        </div>
                                    </div>
                                    : 'Currency rates table'}
                            </th>
                        </tr>
                        <tr>
                            <th colSpan='3'>
                                <div className='pwnz-select pwnz-f-grow1'>
                                    {dateUpdated ?
                                        <select className='pwnz-t-c pwnz-w100 pwnz-mr5' onChange={(e) => changeBaseCurrency(e.target.value)}>
                                            {Object.entries(rates).map(currency => {
                                                if (currency[0] === baseCurrency) {
                                                    return <option value={currency[0]} selected hidden>{currency[0]}</option>
                                                } else {
                                                    return (
                                                        <option value={currency[0]}>{currency[0]}</option>
                                                    )
                                                }
                                            })}
                                        </select>
                                        :
                                        <div className='pwnz-button pwnz-w100' >
                                            <div onClick={() => getCurrency(user.token)}>Get rates</div>
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
        state: state.currency,
        loading: state.app.loading
    }
}

const mapDispatchToProps = {
    getCurrency,
    changeBaseCurrency
}

export default connect(mapStateToProps, mapDispatchToProps)(Currency);