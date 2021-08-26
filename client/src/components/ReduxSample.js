import { connect } from 'react-redux';
import React, { useRef } from 'react';
import { createString, createAsyncString } from '../redux/actions';
import { Loader } from './Loader';

const ReduxSample = ({ state, loading, createString, createAsyncString }) => {
    const inputRef = useRef();

    const alert = state.alert;

    // if (loading) {
    //     return (
    //         <Loader />
    //     )
    // }
    
    const addString=()=>{
        const string=inputRef.current.value;
        createString(string)    
    }

    const addAsyncString=()=>{
        const string=inputRef.current.value;
        createAsyncString(string)    
    }

    return (
        <>  
        {loading?<Loader/>:null}
            <div className='pwnz-col mainForm pwnz-p10 pwnz-w600'>
                <div>
                    {alert ?
                        <p className={'pwnz-t-c pwnz-mt0 pwnz-alert-' + alert.status}>{alert.text}</p>
                        : null}
                    <input ref={inputRef} 
                    placeholder='Enter text' 
                    maxLength='32' 
                    ></input>
                </div>
                <div className='pwnz-f-es'>
                    <div className='pwnz-f-cc pwnz-f-grow1'>
                    <div className='pwnz-button'>
                            <div onClick={addString}>Add string</div>
                        </div>
                        {state.strings.length||state.asyncStrings.length?
                        <div className='pwnz-mt10 pwnz-bb-lightgray pwnz-w100'>
                        </div>:null}
                        {state.strings.map(string => (
                                <p className='pwnz-mb0'>{string}</p>
                        ))}
                    </div>
                    <div className='pwnz-f-cc pwnz-f-grow1'>
                    <div className='pwnz-button pwnz-ml10' >
                            <div onClick={addAsyncString}>Add async string (1 second delay)</div>
                        </div>
                        {state.asyncStrings.length||state.strings.length?
                        <div className='pwnz-mt10 pwnz-bb-lightgray pwnz-w100 '>
                        </div>:null}
                         {state.asyncStrings.map(string => (
                            <p className='pwnz-mb0'>{string}</p>
                    ))}
                    </div>

                </div>

            </div>
        </>
    )
}

const mapStateToProps = state => {
    console.log(state);
    return {
        state: state.reduxSample,
        loading: state.app.loading
    }
}

const mapDispatchToProps = {
    createString,
    createAsyncString
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxSample);