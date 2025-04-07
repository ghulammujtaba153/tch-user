import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import AddPaymentModal from '../../components/dashboard/AddPaymentMethod';
import { toast } from 'react-toastify';

const Withdrawal = () => {
  const { user } = useContext(AuthContext)!;
  const [loading, setLoading] = useState<boolean>(true);
  const [withDrawModal, setWithDrawModal] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [apiLoading, setAPILoading] = useState<boolean>(false);

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWithdrawalAmount(isNaN(value) ? 0 : value);
  };

  const handleWithdraw = async () => {
    try {
      setAPILoading(true);
      
      if (withdrawalAmount <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }

      const res = await axios.post(`${BASE_URL}/requests`, {
        userId: user.userId,
        amount: withdrawalAmount,
      });
      console.log(res.data);
      // const res =await axios.post(`${BASE_URL}/account/withdraw/${user.userId}`, {
      //   amount: withdrawalAmount,
      // })
      // console.log(res.data)
      // setAmount(parseInt(amount.toString()) - parseInt(withdrawalAmount.toString()));
      // setWithdrawalAmount(0);
      setWithDrawModal(false);

    } catch (error: any) {
      console.error("Withdrawal error:", error);
      alert("Withdrawal failed. Please try again.");
    } finally {
      setAPILoading(false);
    }
  };

  if (loading) {
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
          onClick={() => setWithDrawModal(true)}
          className='bg-[#BEE36E] max-w-fit mx-auto text-sm text-black px-4 py-2 rounded-full'
        >
          Withdraw
        </button>
      </div>

      {/* WithDraw Modal */}
      {withDrawModal && (
        <div
          className='fixed bg-black bg-opacity-50 inset-0 z-50 flex justify-center items-center'
          onClick={() => setWithDrawModal(false)} // Close when clicking overlay
        >
          <div
            className='bg-white p-8 rounded-md relative'
            onClick={(e) => e.stopPropagation()} // Prevent click from reaching overlay
          >
            <button
              onClick={() => setWithDrawModal(false)}
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
            <h1 className='text-2xl font-semibold text-[#BEE36E]'>Withdrawal</h1>
            <p className='text-sm text-gray-500'>Enter the amount you want to withdraw</p>
            <input
              type="number"
              value={withdrawalAmount}
              onChange={handleAmountChange}
              min="0"
              step="0.01"
              placeholder='Amount'
              className='w-full px-4 py-2 border border-gray-300 rounded-md mt-4'
            />
            <button
              onClick={handleWithdraw}
              disabled={apiLoading}
              className='bg-[#BEE36E] max-w-fit mx-auto text-sm text-black px-4 py-2 rounded-full mt-4'
            >
              {
                apiLoading ? "Processing..." : "Withdraw"
              }
              
            </button>
          </div>
        </div>
      )}

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