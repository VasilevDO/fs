import React, {Component} from 'react';
import './AuthForm.css';


class AuthForm extends Component {
    constructor (props) {
        super(props);
        this.state={
            login:true,
            email:null,
            password:null,
            name:null
        }
    }

   handleLoginTabClick=()=> {
        this.setState({
            login:true
        });
        window.M.updateTextFields();
    }

    handleInputChange=(e)=> {
        this.setState({
            [e.target.name]:e.target.value
        })

    }

   handleSignupTabClick=()=> {
        this.setState({
            login:false
        });
    }

    handleAuthFormSubmit=()=> {
       this.props.handleAuthFormSubmit(this.state);
    }


    render() {
        const loginTabClassName='auth-form-tab'+(this.state.login? ' auth-form-tab-active':'');
        const signupTabClassName='auth-form-tab'+(this.state.login?'':' auth-form-tab-active');
        const buttonState=this.state.email&&this.state.password?0:1;
       

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
                        {!this.state.login? (
                            <div className='input-field'>
                            <input 
                                placeholder='Enter name'
                                id='name'
                                type='text'
                                name='name'
                                className=''
                                onChange={this.handleInputChange}
                           />
                           <label className='active' htmlFor='name'>Name</label>
                    </div>
                        ) : null}
                        <div className='input-field'>
                                <input 
                                    placeholder='Enter email'
                                    id='email'
                                    type='text'
                                    name='email'
                                    className=''
                                    onChange={this.handleInputChange}
                               />
                               <label htmlFor='email'>Email</label>
                        </div>
                        <div className='input-field'>
                                <input 
                                    placeholder='Enter password'
                                    id='password'
                                    type='password'
                                    name='password'
                                    className=''
                                    onChange={this.handleInputChange}
                               />
                               <label htmlFor='password'>Password</label>
                        </div>
                        <div className="card-action center-align">
                            <button 
                            className='auth-form-submit-button'
                            onClick={this.handleAuthFormSubmit}
                            disabled={buttonState}
                            >{this.state.login?'Login':'Signup'}
                            </button>
                        </div>
                     </div>
                    </div>
                </div>
                </>
            );
    }
}

export default AuthForm;