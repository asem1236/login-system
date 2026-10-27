import { useContext, useEffect, useRef } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

export const Email_Verify = () => {
    const navigate = useNavigate();
    const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);

    const inputRefs = useRef([]);
    const hasSentOtp = useRef(false);  // ← guard to prevent double send

    // Redirect if already verified
    useEffect(() => {
        if (isLoggedin && userData && userData.isAccountVerified) {
            navigate('/');
        }
    }, [isLoggedin, userData, navigate]);

    const handleInput = (e, index) => {
        // Allow only numbers
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (e.target.value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        paste.split('').forEach((char, i) => {
            if (inputRefs.current[i]) {
                inputRefs.current[i].value = char;
            }
        });
        const nextEmpty = Math.min(paste.length, 5);
        inputRefs.current[nextEmpty]?.focus();
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const otp = inputRefs.current.map(ref => ref.value).join('');
        if (otp.length < 6) {
            return toast.error('Please enter the complete 6-digit OTP');
        }
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp });
            if (data.success) {
                toast.success('Email verified successfully');
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const sendOtp = async () => {
        if (hasSentOtp.current) return;  // ← prevent double send
        hasSentOtp.current = true;
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
            if (data.success) {
                toast.success('Verification OTP Sent on Email');
            } else {
                hasSentOtp.current = false; // allow retry if it failed
                toast.error(data.message);
            }
        } catch (error) {
            hasSentOtp.current = false;
            toast.error(error.message);
        }
    };

    // Send OTP only ONCE when page loads (guard prevents StrictMode double-invoke)
    useEffect(() => {
        if (isLoggedin && userData && !userData.isAccountVerified) {
            sendOtp();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedin, userData]);

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt="logo"
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
            />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>Email Verify OTP</h2>
                <p className='text-center text-sm mb-6'>Enter the 6-digit code sent to your email id.</p>

                <form onSubmit={onSubmitHandler}>
                    <div className='flex justify-between mb-8 gap-2' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type='text'
                                inputMode='numeric'
                                maxLength={1}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className='w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md outline-none border-2 border-transparent focus:border-indigo-400 transition-colors'
                                required
                            />
                        ))}
                    </div>
                    <button
                        type='submit'
                        className='cursor-pointer w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:opacity-90 transition-opacity'
                    >
                        Verify email
                    </button>
                </form>
            </div>
        </div>
    );
};
