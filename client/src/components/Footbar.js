import React, { useContext, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import vkPng from '../assets/buttons/VK.png';
import { PwnzSendTextForm } from './PwnzSendTextForm';
import $ from 'jquery';
import { useHttp } from '../hooks/http.hook';

export const Footbar = () => {
    const auth = useContext(AuthContext);
    const { request } = useHttp();
    const [feedbackForm, setFeedbackForm] = useState(false);
    const [feedbackFormMessage, setFeedbackFormMessage] = useState('');

    const showFeedbackForm = () => {
        setFeedbackForm(true);
    }

    const hideFeedbackForm = (e) => {
        const target = $(e.target);
        if (target.hasClass('pwnz-grayout')) {
            setFeedbackForm(false)
        }
    }

    const sendFeedback = useCallback(async (name, text) => {
        try {
            const response = await request('/api/feedback/create', 'POST', {
                senderName: name,
                feedbackText: text
            }, {
                Authorization: `Bearer ${auth.token}`,
                userId: auth.userId,
            });
            setFeedbackFormMessage(response.message);
        } catch (e) {
        }
    }, [auth.token,auth.userId,request]);

    const clearFeedbackForm = () => {
        setFeedbackForm(false)
        setFeedbackFormMessage(false);
    }

    return (
        <div className='pwnz-footbar'>
            <ul className='pwnz-ul-hor'>
                <li><Link to='/bio'><img alt='vk' className='pwnz-button-30x30' src={vkPng} /></Link></li>
                <li><div className='pwnz-footbar-button pwnz-f-c' onClick={showFeedbackForm}>Feedback</div></li>

            </ul>
            <p className='pwnz-t-c pwnz-m0'>pwnzforever 2021 - {new Date().getFullYear()}</p>
            {feedbackForm ? (
                <div className='pwnz-grayout' onClick={hideFeedbackForm}>
                    <PwnzSendTextForm
                        user={auth}
                        message={feedbackFormMessage}
                        onCancel={() => setFeedbackForm(false)}
                        onSubmit={sendFeedback}
                        onClear={clearFeedbackForm}
                    />
                </div>
            )
                : null}
        </div>
    )
}