import React, {Component} from 'react';
import './AuthForm.css';
import $ from 'jquery';
import showPNG from '../assets/buttons/show.png';
import closePNG from '../assets/buttons/hide.png';

class AuthForm extends Component {
    constructor (props) {
        super(props);
        this.state={
            form:'login',
            email:'',
            password:'',
            passwordVisible:false,
            passwordConfirm:'',
            passwordConfirmVisible:false,
            name:'',
            emailAlert:null,
            passwordAlert:null,
            nameAlert:null
        }
    }

   handleLoginTabClick=()=> {
        this.setState({
            form:'login'
        });
       
    }

    validatePassword=(target)=> {
        const password=target.val();
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
                text:'Password'
            } 
        }
        this.setState({
            [target.attr('name')]:password,
            [target.attr('name')+'Alert']:alert
        })
    }

    validatePasswordConfirm=(target)=> {
        const password=target.val();
        const mainInputValue=target.parent().siblings('.input-field').find('input[name="password"]').val();
        let alert;
        if (password==='') {
            alert = null;
        } else if (password!==mainInputValue) {
            alert = {
                status:'error',
                color:'red',
                text:'Confirm password should match password'
            }
        } else {
            alert = {
                status:'passed',
                color:'green',
                text:'Confirm password'
            }
        }
        this.setState({
            [target.attr('name')]:password,
            [target.attr('name')+'Alert']:alert
        })
    }

    validateName=(target)=> {
        const name=target.val();
        let alert;
        if (name==='') {
            alert=null;
        } else if (!name.match(/^[a-zA-Z0-9А-Яа-я]+$/g)) {
            alert= {
                status:'error',
                color:'red',
                text:'Name should contain only letters and numbers'
            }  
        } else {
            alert = {
                status:'passed',
                color:'green',
                text:'Name'
            }   
        }
        this.setState({
            [target.attr('name')]:name,
            [target.attr('name')+'Alert']:alert
        })
    }

    validateEmail=(target)=> {
        const email=target.val();
        let alert;
        if (email==='') {
            alert=null;
        } else if (email!==''&&!email.match(/^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/)) {
            alert= {
                status:'error',
                color:'red',
                text:'Invalid email format'
            }   
        } else {
            alert ={
                status:'passed',
                color:'green',
                text:'Email'
            }        
        }
        this.setState({
            [target.attr('name')]:email,
            [target.attr('name')+'Alert']:alert
        })
    }

    handleInputChange=(e)=> {
        if (e.target.name==='password') {
            this.validatePassword($(e.target)); 
            const confirmInput=$(e.target).parent().siblings('.input-field').find('input[name="passwordConfirm"]');
            if (confirmInput.length===1) {
                this.validatePasswordConfirm(confirmInput);
            }
        } else if (e.target.name==='passwordConfirm') {
            this.validatePasswordConfirm($(e.target));
        } else if (e.target.name==='name') {
            this.validateName($(e.target))
        } else if (e.target.name==='email') {
            this.validateEmail($(e.target))
        }
    }

    handleKeyPress=(e)=> {
        if (e.key!=='Enter') return;
        let next=$(e.target).parent().siblings('.input-field').find('input:not(.input-passed)');
        if (!next.length) {
            this.handleAuthFormSubmit();
        } else {
            next.focus();
        }    
    }

   handleSignupTabClick=()=> {
        this.setState({
            form:'signup'
        });
    }

    handleAuthFormSubmit=()=> {
       this.props.handleAuthFormSubmit({
           form:this.state.form,
           email:this.state.email,
           name:this.state.name,
           password:this.state.password
       });
    }

    handleForgotPasswordClick=()=> {
        this.setState({
            form:'recover'
        })
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

    render() {
        const form=this.state.form;

        const loginTabClassName='auth-form-tab'+(form==='login'? ' auth-form-tab-active':' auth-form-tab-inactive');
        const signupTabClassName='auth-form-tab'+(form==='signup'?' auth-form-tab-active':' auth-form-tab-inactive');
       
        const nameAlert=this.state.nameAlert;
        const nameClassName=(nameAlert?'input-'+nameAlert.status:'');

        const emailAlert=this.state.emailAlert;
        const emailClassName=(emailAlert?'input-'+emailAlert.status:'');

        const passwordAlert=this.state.passwordAlert;
        const passwordImg=this.state.passwordVisible?closePNG:showPNG;
        const passwordClassName=(passwordAlert?'input-'+passwordAlert.status:'');

        const passwordConfirmAlert=this.state.passwordConfirmAlert;
        const passwordConfirmImg=this.state.passwordConfirmVisible?closePNG:showPNG;
        const passwordConfirmClassName=(passwordConfirmAlert?'input-'+passwordConfirmAlert.status:'');

        const buttonState=
            form==='login'?
        !((emailAlert?emailAlert.status==='passed':null)&&(passwordAlert?passwordAlert.status==='passed':null)):
        form==='signup'?
        !((nameAlert?nameAlert.status==='passed':null)&&(emailAlert?emailAlert.status==='passed':null)&&(passwordAlert?passwordAlert.status==='passed':null)&&(passwordConfirmAlert?passwordConfirmAlert.status==='passed':null)):
        !(emailAlert?emailAlert.status==='passed':null);

        const message=this.props.message;
        const messageText=message?message.text:null;
        const messageClassName=message?('auth-form-message-'+message.type):null;

        

            return (
                <>
                <div className='inner'>                
                    <div className='auth-form'>
                     <div className='auth-form-tabs'>
                         <div className={loginTabClassName}
                         onClick={this.handleLoginTabClick}>
                             <p>Login</p>
                         </div>
                         <div className={signupTabClassName}
                          onClick={this.handleSignupTabClick}>
                             <p>Signup</p>
                         </div>
                     </div>
                     <div className='auth-form-body'>
                        {message?
                        <p className={messageClassName}>{messageText}</p>:null
                        } 
                        {form==='signup'? (
                            <div className='input-field'>
                            <input 
                                placeholder='Enter name'
                                value={this.state.name}
                                id='name'
                                type='text'
                                name='name'
                                className={'pwnz-input '+nameClassName}
                                onChange={this.handleInputChange}
                                onKeyPress={this.handleKeyPress}
                           />
                           <label htmlFor='name' className='active' style={{color:nameAlert?nameAlert.color:null}}>{nameAlert?nameAlert.text:'Name'}</label>
                    </div>
                        ) : null}
                        <div className='input-field'>
                                <input 
                                    placeholder='Enter email'
                                    value={this.state.email}
                                    id='email'
                                    type='text'
                                    name='email'
                                    className={'pwnz-input '+emailClassName}
                                    onChange={this.handleInputChange}
                                    onKeyPress={this.handleKeyPress}
                               />
                               <label htmlFor='email' className='active' style={{color:emailAlert?emailAlert.color:null}}>{emailAlert?emailAlert.text:'Email'}</label>
                        </div>
                        {form==='login'||form==='signup'?(
                              <div className='input-field'>
                                  <div className='auth-form-inputToggle' onClick={this.togglePasswordVisibility}><img src={passwordImg} className='pwnz-button-30x30'/></div>
                                <input 
                                    placeholder='Enter password'
                                    value={this.state.password}
                                    id='password'
                                    type={this.state.passwordVisible?'text':'password'}
                                    name='password'
                                    className={'pwnz-input '+passwordClassName}
                                    onChange={this.handleInputChange}
                                    onKeyPress={this.handleKeyPress}
                                />
                             <label htmlFor='password' className='active' style={{color:passwordAlert?passwordAlert.color:null}}>{passwordAlert?passwordAlert.text:'Password'}</label>
                      </div>
                        ):null} 
                        {form==='signup'?(
                              <div className='input-field'>
                              <div className='auth-form-inputToggle' onClick={this.togglePasswordConfirmVisibility}><img src={passwordConfirmImg} className='pwnz-button-30x30'/></div>
                              <input 
                                    placeholder='Confirm password'
                                    value={this.state.passwordConfirm}
                                    id='passwordConfirm'
                                    type={this.state.passwordConfirmVisible?'text':'password'}
                                    name='passwordConfirm'
                                    className={'pwnz-input '+passwordConfirmClassName}
                                    onChange={this.handleInputChange}
                                    onKeyPress={this.handleKeyPress}
                               />
                               <label htmlFor='password' className='active' style={{color:passwordConfirmAlert?passwordConfirmAlert.color:null}}>{passwordConfirmAlert?passwordConfirmAlert.text:'Confirm password'}</label>
                           </div>
                        ):null} 
                        <div className="card-action center-align">
                            <button 
                            className='auth-form-submit-button'
                            onClick={this.handleAuthFormSubmit}
                            disabled={buttonState}
                            >{form==='login'?'Login':form==='signup'?'Signup':'Recover password'}
                            </button>
                        </div>
                        {form==='login'?
                        <p className='auth-form-forgot-password' onClick={this.handleForgotPasswordClick}>Forgot password?</p>
                        :null}
                     </div>
                     
                    </div>
                </div>
                </>
            );
    }
}

export default AuthForm;