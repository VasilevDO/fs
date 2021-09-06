import React, { useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import ResetForm from '../components/ResetForm';
import { useLocation, useHistory } from 'react-router-dom';

const ResetPage = () => {
    const [message, setMessage] = useState(null);
    const { request } = useHttp(); //const {loading,request,error,clearError} = useHttp();
    const location = useLocation();
    const history = useHistory();

    const handleReset = async (data) => {
        try {
            const form = {
                password: data.password,
                passwordResetId: location.pathname.match(/(?<=\/reset\/)[0-9A-Za-z]+/)[0]
            }
            const respData = await request('/api/auth/reset', 'POST', { ...form });
            setMessage({
                text: respData.message,
                type: 'positive'
            });

            setTimeout(() => {
                history.push('/');
            }, 2000)

        } catch (e) {
            setMessage({
                text: e.message,
                type: 'negative'
            });
        }
    }

    return (
        <div className='resetpage-container'>
            <ResetForm handleResetFormSubmit={handleReset} message={message}></ResetForm>
        </div>
    )
}

export default ResetPage;