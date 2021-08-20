import React, {useState} from'react';
import PwnzTextContainer from './PwnzTextContainer'


export const PwnzSendTextForm = (props)=> {


    const {user,message,minTextHeight,maxTextHeight,onCancel,onSubmit,onClear,minSenderNameHeight,maxSenderNameHeight}=props;

    const [formText,setFormText]=useState('');
    const [senderName,setSenderName]=useState(user.userName);
    const [alert,setAlert]=useState('');

    const submitForm=()=>{
        if (!formText) {
            console.log('1')
            setAlert({
                status:'red',
                text:'Text field can not be empty'
            });
            return;
        }
        onSubmit(senderName,formText);
    }

        return (
            <div className='pwnz-feedbackForm'>
                {message ?
                    <>
                        <p className='pwnz-t-c pwnz-mt0 pwnz-mb10'>{message}</p>
                        <div className='pwnz-reportForm-buttons pwnz-f-c pwnz-mt10'>
                            <div className='pwnz-button pwnz-f-c' >
                                <div onClick={onClear}>Ok</div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        {alert ? <p className={'pwnz-t-c pwnz-mt0 pwnz-mb10' + (alert.status === 'red' ? ' pwnz-alert-red' : ' pwnz-alert-green')}>{alert.text}</p> : null}
                        <PwnzTextContainer
                            value={senderName}
                            minHeight={minSenderNameHeight||20}
                            maxHeight={maxSenderNameHeight||50}
                            placeholder={"What is your name? Keep empty if you want to stay anonymous"}
                            editable={true}
                            textAlign={"left"}
                            onChange={(value)=>setSenderName(value)}
                        />
                        <div className='pwnz-mb10'/>
                        <PwnzTextContainer
                            value={formText}
                            minHeight={minTextHeight||40}
                            maxHeight={maxTextHeight||150}
                            placeholder={"What do you think?"}
                            editable={true}
                            textAlign={"left"}
                            onChange={(value)=>setFormText(value)}
                        />
                        <div className='pwnz-reportForm-buttons pwnz-f-c pwnz-mt10'>
                            <div className='pwnz-button pwnz-f-c' >
                                <div onClick={submitForm}>Send feedback</div>
                            </div>
                            <div className='pwnz-button pwnz-f-c' >
                                <div onClick={onCancel}>Cancel</div>
                            </div>
                        </div>
                    </>}
            </div>
        )
            
}


