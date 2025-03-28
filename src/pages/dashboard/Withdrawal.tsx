import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import AddPaymentModal from '../../components/dashboard/AddPaymentMethod';

const Withdrawal = () => {
  const { user } = useContext(AuthContext)!;

  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchWithdrawalData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/donations/total/amount/${user.userId}`);
        console.log(response.data);
        setAmount(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching withdrawal data:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchWithdrawalData();
    }
  }, [user]);

  const handleWithdraw = async () => {
    try {
      alert("Withdrawal successful!");
      setAmount("");

    } catch (error: any) {
      console.error("Withdrawal error:", error);
      alert("Withdrawal failed. Please try again.");
    }
  };

  if(loading) {
    return (<div>Loading...</div>)
  }

  return (
    <div className='flex flex-col md:flex-row justify-between gap-8 md:gap-4 p-4 text-gray-500'>
      {/* Left Section - Withdrawal Form */}
      <div className='flex flex-col gap-4 flex-1'>
        <div className='flex flex-col gap-4 py-6 px-6 border border-gray-300 rounded-md'>
          <p className='text-sm text-gray-500'>Total Available Balance</p>
          <h1 className='text-2xl font-bold text-black'>{amount}</h1>
        </div>

        <h1 className='text-2xl font-semibold text-[#BEE36E]'>Withdrawal</h1>

        

        <button
          onClick={handleWithdraw}
          className='bg-[#BEE36E] max-w-fit mx-auto text-sm text-black px-4 py-2 rounded-full'
        >
          Withdraw
        </button>
      </div>

      {/* Vertical Line */}
      <div className='hidden md:block w-[1px] bg-gray-200 self-stretch mx-4'></div>

      {/* Right Section - Payment Methods */}
      <div className='flex flex-col gap-4 flex-1'>

        <button onClick={() => setIsModalOpen(true)} className='text-[#BEE36E] hover:bg-[#BEE36E] hover:text-black cursor-pointer border border-[#BEE36E] max-w-fit mx-auto text-sm px-4 py-2 rounded-full flex items-center gap-2'>
          Add Card
          <ArrowRightIcon className='w-4 h-4' />
        </button>

        {isModalOpen && (
        <AddPaymentModal
          userId={user?.userId} // Pass the user ID
          onClose={() => setIsModalOpen(false)}
        />
      )}
      </div>
    </div>
  );
};

export default Withdrawal;