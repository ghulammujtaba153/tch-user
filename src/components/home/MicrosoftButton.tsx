import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirect handling
import { SOCKET_URL } from '../../config/url';

const MicrosoftLoginButton = () => {
    const navigate = useNavigate();

    // Extract token from URL after redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token); // Store the token securely
            navigate('/user/dashboard/overview'); // Redirect to the protected route
        }
    }, []);

    const handleMicrosoftLogin = () => {
        window.location.href = `${`${SOCKET_URL}`}/auth/microsoft`;
    };

    return (
        <button
            onClick={handleMicrosoftLogin}
            type='button'
            style={{
                backgroundColor: '#2F2F2F',
                color: '#FFFFFF',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft Logo"
                style={{ width: '20px', height: '20px' }}
            />
            <span>Login with Microsoft</span>
        </button>
    );
};

export default MicrosoftLoginButton;
