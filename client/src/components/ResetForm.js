import React, {Component, createRef} from 'react';
import './ResetForm.css';
import $ from 'jquery';
import showPNG from '../assets/buttons/show.png';
import closePNG from '../assets/buttons/hide.png';


class ResetForm extends Component {
    constructor (props) {
        super(props);
        this.state={
            password:'',
            passwordAlert:null,
            passwordVisible:false,
            passwordConfirm:'',
            passwordConfirmAlert:null,
            passwordConfirmVisible:false
        }
        this.passwordRef=createRef();
        this.confirmPasswordRef=createRef();
    }

    validatePassword=(target)=> {
        const password=this.passwordRef.current.value;
        let alert;
        if (password==='') {
            alert=null;
        } else if (password.length<6) {
            alert= {
                status:'error',
                color:'red',
                text:'Password length should be 6-16 characters'
            } 
        } else {
            alert = {
                status:'passed',
                color:'green',
                text:'New password'
            } 
        }
        this.setState({
            [target.attr('name')]:password,
            [target.attr('name')+'Alert']:alert
        })
    }

    validatePasswordConfirm=(target)=> {
        const password=this.passwordRef.current.value;
        const  confirmPassword=this.confirmPasswordRef.current.value;
        let alert;
        if (confirmPassword==='') {
            alert = null;
        } else if (confirmPassword!==password) {
            alert = {
                status:'error',
                color:'red',
                text:'Confirm password should match password'
            }
        } else {
            alert = {
                status:'passed',
                color:'green',
                text:'New password'
            }
        }
        this.setState({
            [target.attr('name')]:confirmPassword,
            [target.attr('name')+'Alert']:alert
        })
    }
    


    handleInputChange=(e)=> {
        if (e.target.name==='password') {
            this.validatePassword($(this.passwordRef.current)); 
            this.validatePasswordConfirm($(this.confirmPasswordRef.current));
        } else if (e.target.name==='passwordConfirm') {
            this.validatePasswordConfirm($(this.confirmPasswordRef.current));
        }
    }

    handleKeyPress=(e)=> {
        if (e.key!=='Enter') return;
        let next=$(e.target).parent().siblings('.input-field').find('input:not(.input-passed)');
        if (!next.length) {
            this.handleResetFormSubmit();
        } else {
            next.focus();
        }    
    }

    togglePasswordVisibility=()=>{
        this.setState({
            passwordVisible:!this.state.passwordVisible
        })
    }

    togglePasswordConfirmVisibility=()=>{
        this.setState({
            passwordConfirmVisible:!this.state.passwordConfirmVisible
        })
    }

    handleResetFormSubmit=()=> {
        this.props.handleResetFormSubmit({
            password:this.state.password
        });
     }


    render() {
        const passwordAlert=this.state.passwordAlert;
        const passwordClassName=(passwordAlert?'input-'+passwordAlert.status:'');
        const passwordImg=this.state.passwordVisible?closePNG:showPNG;

        const passwordConfirmAlert=this.state.passwordConfirmAlert;
        const passwordConfirmClassName=(passwordConfirmAlert?'input-'+passwordConfirmAlert.status:'');
        const passwordConfirmImg=this.state.passwordConfirmVisible?closePNG:showPNG;
    
        const buttonState=!((passwordAlert?passwordAlert.status==='passed':null)&&(passwordConfirmAlert?passwordConfirmAlert.status==='passed':null));

        const message=this.props.message;
        const messageText=message?message.text:null;
        const messageClassName=message?('reset-form-message-'+message.type):null;

            return (
                <>
                <div className='inner'>                
                    <div className='reset-form mainForm'>
                     <div className='reset-form-body'>
                     {message?
                        <p className={messageClassName}>{messageText}</p>:null
                        } 
                        <div className='input-field'>
                        <label htmlFor='password' className='active' style={{color:passwordAlert?passwordAlert.color:null}}>{passwordAlert?passwordAlert.text:'New password'}</label>

                            <div className='pwnz-input'>
                            <input 
                                  placeholder='Enter new password'
                                  value={this.state.password}
                                  id='password'
                                  type={this.state.passwordVisible?'text':'password'}
                                  name='password'
                                  className={'pwnz-input '+passwordClassName}
                                  onChange={this.handleInputChange}
                                  onKeyPress={this.handleKeyPress}
                                  ref={this.passwordRef}
                            />
                            <div className='reset-form-inputToggle' onClick={this.togglePasswordVisibility}><img src={passwordImg} className='pwnz-button-30x30'/></div>
                        </div>
                         </div>
                        <div className='input-field'>
                            <label htmlFor='password' className='active' style={{color:passwordConfirmAlert?passwordConfirmAlert.color:null}}>{passwordConfirmAlert?passwordConfirmAlert.text:'Confirm new password'}</label>
                            <div className='pwnz-input'>
                            <input 
                                  placeholder='Confirm new password'
                                  value={this.state.passwordConfirm}
                                  id='passwordConfirm'
                                  type={this.state.passwordConfirmVisible?'text':'password'}
                                  name='passwordConfirm'
                                  className={'pwnz-input '+passwordConfirmClassName}
                                  onChange={this.handleInputChange}
                                  onKeyPress={this.handleKeyPress}
                                  ref={this.confirmPasswordRef}
                             />
                            <div className='reset-form-inputToggle' onClick={this.togglePasswordConfirmVisibility}><img src={passwordConfirmImg} className='pwnz-button-30x30'/></div>
                        </div>
                         </div>
                        <div className="card-action center-align">
                            <button 
                            className='reset-form-submit-button'
                            onClick={this.handleResetFormSubmit}
                            disabled={buttonState}
                            >Set new password
                            </button>
                        </div>
                     </div>
                     
                    </div>
                </div>
                </>
            );
    }
}

export default ResetForm;