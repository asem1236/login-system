import { useContext, useRef, useState } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContent);

    // Step 1: Enter email
    // Step 2: Enter OTP
    // Step 3: Enter new password
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [savedOtp, setSavedOtp] = useState('');   // ← store OTP before step 3

    const inputRefs = useRef([]);

    // ---- Step 1: Send Reset OTP ----
    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
            if (data.success) {
                toast.success('OTP sent to your email');
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ---- OTP Input Handlers ----
    const handleInput = (e, index) => {
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

    // ---- Step 2: Verify OTP ----
    const onSubmitOtp = async (e) => {
        e.preventDefault();
        const otp = inputRefs.current.map(ref => ref.value).join('');
        if (otp.length < 6) {
            return toast.error('Please enter the complete 6-digit OTP');
        }
        // Save OTP in state before inputs unmount
        setSavedOtp(otp);
        setStep(3);
    };

    // ---- Step 3: Reset Password ----
    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
                email,
                otp: savedOtp,   // ← use saved OTP from state
                newPassword
            });
            if (data.success) {
                toast.success('Password has been reset successfully');
                navigate('/login');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt="logo"
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
            />

            {/* Step 1: Email */}
            {step === 1 && (
                <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                    <h2 className='text-3xl font-semibold text-white text-center mb-3'>Reset password</h2>
                    <p className='text-center text-sm mb-6'>Enter your registered email address</p>
                    <form onSubmit={onSubmitEmail}>
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                            <img src={assets.mail_icon} alt="" />
                            <input
                                type='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder='Email id'
                                className='bg-transparent outline-none w-full text-white placeholder-indigo-300'
                                required
                            />
                        </div>
                        <button
                            type='submit'
                            className='cursor-pointer w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:opacity-90 transition-opacity'
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
                <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                    <h2 className='text-3xl font-semibold text-white text-center mb-3'>Reset password OTP</h2>
                    <p className='text-center text-sm mb-6'>Enter the 6-digit code sent to your email id.</p>
                    <form onSubmit={onSubmitOtp}>
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
                            Submit
                        </button>
                    </form>
                </div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
                <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                    <h2 className='text-3xl font-semibold text-white text-center mb-3'>New password</h2>
                    <p className='text-center text-sm mb-6'>Enter the new password below</p>
                    <form onSubmit={onSubmitNewPassword}>
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                            <img src={assets.lock_icon} alt="" />
                            <input
                                type='password'
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder='Password'
                                className='bg-transparent outline-none w-full text-white placeholder-indigo-300'
                                required
                                minLength={6}
                            />
                        </div>
                        <button
                            type='submit'
                            className='cursor-pointer w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:opacity-90 transition-opacity'
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
