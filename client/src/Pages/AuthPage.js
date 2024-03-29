import React, {useContext, useState } from 'react';
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const AuthPage=()=> {
    const auth=useContext(AuthContext);
    const [message,setMessage]=useState(null);
    const {request} = useHttp(); //const {loading,request,error,clearError} = useHttp();

    const handleAuth=async (data)=> {
        try {
            const type=data.form;
            const form={
                email:data.email,
                name:data.name,
                password:data.password
            };
            if (type==='login') {
                const data=await request('/api/auth/login', 'POST', {...form});
                auth.login(data.token, data.userId,data.userName,data.userRights);
            } else if (type==='signup') {
                const data=await request('/api/auth/register', 'POST', {...form});
                auth.login(data.token, data.userId,data.userName,data.userRights);
            } else if (type==='recover') {
                const data=await request('/api/auth/recover', 'POST', {...form});
                setMessage({
                    text:data.message,
                    type:'positive'
                });
            }
        } catch (e) {
            setMessage({
                text:e.message,
                type:'negative'
            });
        }
    }

    const handleGuestLogin=async()=>{
        try {
                const data=await request('/api/auth/login', 'GET', null);
                auth.login(data.token, data.userId,data.userName,data.userRights);
        } catch (e) {
            setMessage({
                text:e.message,
                type:'negative'
            });
        }
    }

    return (
        <div className='authpage-container'>
             <AuthForm handleAuthFormSubmit={handleAuth} onGuestLogin={handleGuestLogin} message={message}></AuthForm>                     
        </div>
    )
}

export default AuthPage; 