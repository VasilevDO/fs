import React, {useContext, useEffect } from 'react';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';
import {AuthContext} from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import './AuthPage.css';


const AuthPage=()=> {
    const auth=useContext(AuthContext);
    const message=useMessage();
    const {request,error,clearError} = useHttp(); //const {loading,request,error,clearError} = useHttp();

    useEffect(()=> {
        message(error);
        clearError();
    },[error,message,clearError]);

    useEffect(()=>{
        window.M.updateTextFields();
    },[])

    const handleAuth=async(data)=> {
        try {
            const form={
                email:data.email,
                name:data.name,
                password:data.password
            };
            if (data.login) {
                const data=await request('/api/auth/login', 'POST', {...form});
                auth.login(data.token, data.userId,data.userName);
            } else if (!data.login) {
                const data=await request('/api/auth/register', 'POST', {...form});
                message(data.message);
            }
        } catch (e) {}
    }

    return (
        <>
        <div className='auth-page valign-wrapper'>
             <AuthForm handleAuthFormSubmit={handleAuth}></AuthForm>                     
        </div>
        </>
    )
}

export default AuthPage; 