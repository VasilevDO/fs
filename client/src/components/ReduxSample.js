import { connect } from 'react-redux';
import React, { useRef, useState } from 'react';
import { createString, deleteString, createAsyncString, deleteAsyncString } from '../redux/actions';

const ReduxSample = ({ state, createString, deleteString, createAsyncString, deleteAsyncString }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();
    const alert = state.alert;

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const addString = () => {
        const string = inputRef.current.value;
        createString(string);
        setInputValue('');
    }

    const addAsyncString = () => {
        const string = inputRef.current.value;
        createAsyncString(string);
        setInputValue('');
    }

    return (
        <>
            <div className='pwnz-col mainForm pwnz-p10 pwnz-w600'>
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
                            <div onClick={addString}>Add string</div>
                        </div>
                        {state.strings.length || state.asyncStrings.length ?
                            <div className='pwnz-mt10 pwnz-bb-lightgray pwnz-w100'>
                            </div> : null}
                        {state.strings.map((string, index) => (
                            <div className='pwnz-f-c pwnz-mt10' key={index}>
                                <p className='pwnz-m0'>{string}</p>
                                <div className='pwnz-button pwnz-ml10 pwnz-color-red' >
                                    <div onClick={() => deleteString(index)}>X</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='pwnz-f-cc pwnz-f-grow1'>
                        <div className='pwnz-button pwnz-ml10' >
                            <div onClick={addAsyncString}>Add async string (1 second delay)</div>
                        </div>
                        {state.asyncStrings.length || state.strings.length ?
                            <div className='pwnz-mt10 pwnz-bb-lightgray pwnz-w100 '>
                            </div> : null}
                        {state.asyncStrings.map((string,index) => (
                            <div className='pwnz-f-c pwnz-mt10' key={index}>
                                <p className='pwnz-m0'>{string}</p>
                                <div className='pwnz-button pwnz-ml10 pwnz-color-red' >
                                    <div onClick={() => deleteAsyncString(index)}>X</div>
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
        state: state.reduxSample,
        loading: state.app.loading
    }
}

const mapDispatchToProps = {
    createString,
    deleteString,
    createAsyncString,
    deleteAsyncString
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxSample);