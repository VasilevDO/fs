import { connect } from 'react-redux';
import React, { useState, useRef } from 'react';
import { getCurrency } from '../redux/currencyActions';
import { Loader } from './Loader';

const Currency = ({ state,user, getCurrency }) => {
    // if (loading) {
    //     return (
    //         <Loader/>
    //     )
    // }
    console.log(state);
    return (
        <>
            <div>kekw</div>
            <div className='pwnz-button' >
                <div onClick={()=>getCurrency(user.token)}>get currencies</div>
            </div>
        </>
    )
}

const mapStateToProps = (state,props) => {
    console.log(props.user);
    return {
        user:props.user,
        state: state.currency,
        loading: state.app.loading
    }
}

const mapDispatchToProps = {
    getCurrency
}

export default connect(mapStateToProps, mapDispatchToProps)(Currency);