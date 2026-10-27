import { useContext, useRef, useState } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setIsLoggedin, setUserData } = useContext(AppContent);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/logout');
            if (data.success) {
                setIsLoggedin(false);
                setUserData(null);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} alt="auth logo" className='w-28 sm:w-32' />

            {userData ? (
                <div className='relative' ref={dropdownRef}>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className='w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-semibold cursor-pointer text-sm'
                    >
                        {userData.name[0].toUpperCase()}
                    </div>

                    {dropdownOpen && (
                        <div className='absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border border-gray-100'>
                            {!userData.isAccountVerified && (
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        navigate('/email-verify');
                                    }}
                                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                    Verify email
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setDropdownOpen(false);
                                    logout();
                                }}
                                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    className='cursor-pointer flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
                >
                    Login <img src={assets.arrow_icon} alt="" />
                </button>
            )}
        </div>
    );
};

export default Navbar;