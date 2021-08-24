import { connect } from 'react-redux';
import React, { useState, useRef } from 'react';
import { createString, createAsyncString } from '../redux/actions';
import { Loader } from './Loader';

const ReduxSample = ({ state,loading, createString, createAsyncString }) => {
    const inputRef = useRef();

    if (loading) {
        return (
            <Loader/>
        )
    }

    return (
        <>
            <div className='pwnz-col'>
                <div>
                    <input ref={inputRef} placeholder='Enter text'></input>
                    <button onClick={() => createString(inputRef.current.value)}>Add string</button>
                    <button onClick={() => createAsyncString(inputRef.current.value)}>Add async string</button>
                </div>
                {console.log(state.strings)}
                {state.strings.map(string => (
                    <div className='pwnz-col'>
                        <p>{string}</p>
                    </div>
                ))}
                {state.asyncStrings.map(string => (
                    <div className='pwnz-col'>
                        <p>{string}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

const mapStateToProps = state => {
    console.log(state);
    return {
        state: state.reduxSample,
        loading:state.app.loading
    }
}

const mapDispatchToProps = {
    createString,
    createAsyncString
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxSample);