import {connect} from 'react-redux';
import React, { useState, useRef } from 'react';

const ReduxSample = () => {
    const inputRef = useRef();
    const [strings, setStrings] = useState([]);
    const handleStringAdd = () => {
        setStrings(strings.concat(inputRef.current.value))
    }


    return (
        <>

            <div className='pwnz-col'>
                <div>
                    <input ref={inputRef} placeholder='Enter text'></input>
                    <button onClick={handleStringAdd}>Add string</button>
                </div>
                {console.log(strings)}
                {strings.map(string => (
                    <div className='pwnz-col'>
                        <p>{string}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

const mapStateToProps=state=>{
    return state;
}

export default connect(null,null)(ReduxSample);