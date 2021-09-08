import { connect } from 'react-redux';
import React, { useRef, useState } from 'react';
import { createString, deleteString, createAsyncString, deleteAsyncString } from '../redux/actions';
import { CREATE_ASYNC_STRING, DELETE_ASYNC_STRING } from '../redux/types';

const ReduxSample = ({ state, createString, deleteString, createAsyncString, deleteAsyncString }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();
    const alert = state.alert;
    const processing = state.processing;

    const handleClick=(e)=>{
        // if (processing) {
        //     e.stopPropagation()
        // }
    }

    const handleKeyPress=(e)=>{
        // if (processing) {
        //     e.stopPropagation();
        //     return;
        // } 
        // if (e.key==='Enter') {
        //     e.target.click();
        // }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const addString = () => {
        const string = inputRef.current.value;
        createString(string);
        setInputValue('');
    }

    const addAsyncString = () => {
        if (processing.includes(CREATE_ASYNC_STRING)) return;
        const string = inputRef.current.value;
        createAsyncString(string);
        setInputValue('');
    }

    const removeAsyncString = (index) => {
        if (processing.includes(DELETE_ASYNC_STRING)) return;
        deleteAsyncString(index);
    }

    return (
        <>
            <div className='pwnz-col mainForm pwnz-p10 pwnz-w600' onClickCapture={handleClick} onKeyPressCapture={handleKeyPress}>
                <div>
                    {alert ?
                        <p className={'pwnz-t-c pwnz-mt0 pwnz-alert-' + alert.status}>{alert.text}</p>
                        : null}
                    <input ref={inputRef}
                        placeholder='Enter text'
                        maxLength='32'
                        value={inputValue}
                        onChange={handleInputChange}
                    ></input>
                </div>
                <div className='pwnz-f-es pwnz-mt10'>
                    <div className='pwnz-f-cc pwnz-f-grow1'>
                        <div className='pwnz-button'>
                            <div 
                            tabIndex='0'
                            onClick={addString} 
                            >Add string</div>
                        </div>
                        {state.strings.length || state.asyncStrings.length ?
                            <div className='pwnz-mt10 pwnz-bb-lightgray pwnz-w100'>
                            </div> : null}
                        {state.strings.map((string, index) => (
                            <div className='pwnz-f-c pwnz-mt10' key={index}>
                                <p className='pwnz-m0'>{string}</p>
                                <div className='pwnz-button pwnz-ml10 pwnz-color-red' >
                                    <div 
                                    tabIndex='0'
                                    onClick={() => deleteString(index)}
                                    >X</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='pwnz-f-cc pwnz-f-grow1'>
                        <div className={'pwnz-button'+(processing.includes(CREATE_ASYNC_STRING)?' pwnz-animatedLoading':'')}>
                            <div 
                            tabIndex='0'
                            process={CREATE_ASYNC_STRING}
                            onClick={addAsyncString}
                            >Add async string (random delay from 1 to 5 seconds)</div>
                        </div>
                        {state.asyncStrings.length || state.strings.length ?
                            <div className='pwnz-mt10 pwnz-bb-lightgray pwnz-w100 '>
                            </div> : null}
                        {state.asyncStrings.map((string,index) => (
                            <div className='pwnz-f-c pwnz-mt10' key={index}>
                                <p className='pwnz-m0'>{string}</p>
                                <div className={'pwnz-button pwnz-ml10 pwnz-color-red'+(processing.includes(DELETE_ASYNC_STRING)?' pwnz-animatedLoading':'')}>
                                    <div 
                                    tabIndex='0'
                                    onClick={()=>removeAsyncString(index)}
                                    >X</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        state: state.reduxSample
    }
}

const mapDispatchToProps = {
    createString,
    deleteString,
    createAsyncString,
    deleteAsyncString
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxSample);