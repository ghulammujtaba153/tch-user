import { ArrowRightIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const Withdrawal = () => {
    // State to manage password visibility for each field
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    return (
        <div className='flex flex-col md:flex-row justify-between gap-8 md:gap-4 p-4 text-gray-500'>
            {/* Left Section - Change Password */}
            <div className='flex flex-col gap-4 flex-1'>

                <div className='flex flex-col gap-4 py-6 px-6 border border-gray-300 rounded-md'>
                    <p className='text-sm text-gray-500'>Total Available Balance</p>
                    <h1 className='text-2xl font-bold text-black'>12, 345</h1>

                </div>
                


            <h1 className='text-2xl font-semibold text-[#BEE36E]'>Withdrawal</h1>

            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='amount' className='text-sm text-gray-500'>Enter Amount</label>
                    <input type='number' placeholder='Enter Amount' className=' p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BEE36E]' />
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor='account' className='text-sm text-gray-500'>Select Account</label>
                    <select name="" id="" className='p-2 rounded-md border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEE36E]'>
                        <option value="">Select Account</option>
                        <option value="bank">Bank Account</option>
                        <option value="paypal">Paypal</option>
                        <option value="bitcoin">Bitcoin</option>
                    </select>

                </div>

            </div>

                

                <button className='bg-[#BEE36E] max-w-fit mx-auto text-sm text-black px-4 py-2 rounded-full'>
                    Withdraw
                </button>
            </div>

            {/* Vertical Line */}
            <div className='hidden md:block w-[1px] bg-gray-200 self-stretch mx-4'></div>

            {/* Right Section - Cards */}
            <div className='flex flex-col gap-4 flex-1'>
                <button className='text-[#BEE36E] hover:bg-[#BEE36E] hover:text-black cursor-pointer  border border-[#BEE36E] max-w-fit mx-auto text-sm px-4 py-2 rounded-full flex items-center gap-2'>
                    Add Card
                    <ArrowRightIcon className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
};

export default Withdrawal;