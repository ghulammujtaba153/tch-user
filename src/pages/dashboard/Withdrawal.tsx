import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import AddPaymentModal from '../../components/dashboard/AddPaymentMethod';

const Withdrawal = () => {
  const { user } = useContext(AuthContext)!;
  const [paymentMethods, setPaymentMethods] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    const fetchPaymentMethods = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/payment/get/${user.userId}`);
        setPaymentMethods(res.data.PaymentMethod! || []);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMethods();
  }, [user]);

  const handleWithdraw = async () => {
    if (!amount || !selectedMethod) {
      alert("Please enter an amount and select a payment method.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/withdraw`, {
        userId: user.userId,
        amount: parseFloat(amount),
        paymentMethodId: selectedMethod,
      });
      

      alert("Withdrawal successful!");
      setAmount("");
      setSelectedMethod("");
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      alert("Withdrawal failed. Please try again.");
    }
  };

  return (
    <div className='flex flex-col md:flex-row justify-between gap-8 md:gap-4 p-4 text-gray-500'>
      {/* Left Section - Withdrawal Form */}
      <div className='flex flex-col gap-4 flex-1'>
        <div className='flex flex-col gap-4 py-6 px-6 border border-gray-300 rounded-md'>
          <p className='text-sm text-gray-500'>Total Available Balance</p>
          <h1 className='text-2xl font-bold text-black'>12, 345</h1>
        </div>

        <h1 className='text-2xl font-semibold text-[#BEE36E]'>Withdrawal</h1>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='amount' className='text-sm text-gray-500'>Enter Amount</label>
            <input
              type='number'
              placeholder='Enter Amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BEE36E]'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='account' className='text-sm text-gray-500'>Select Account</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className='p-2 rounded-md border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BEE36E]'
            >
              <option value="">Select Account</option>
              {paymentMethods.map((method: any) => (
                <option key={method.paymentId} value={method.paymentId}>
                  {method.type} - {method.details.cardNumber || method.details.paypalEmail || method.details.bankAccountNumber || method.details.bitcoinWallet}
                </option>
              ))}
            </select>
          </div>
        </div>

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
        {loading ? (<p>Loading...</p> ):(
        paymentMethods && paymentMethods.length > 0 && paymentMethods.map((method: any) => (
          <div key={method.paymentId} className='flex flex-col gap-4 py-6 px-6 border border-gray-300 rounded-md'>
            <p className='text-sm text-gray-500'>Payment Method</p>
            {method.type === "card" && (
              <>
                <h1 className='text-2xl font-bold text-black'>{method.details.cardNumber}</h1>
                <p className='text-sm text-gray-500'>Expires on {method.details.expirationDate}</p>
              </>
            )}
            {method.type === "paypal" && (
              <h1 className='text-2xl font-bold text-black'>{method.details.paypalEmail}</h1>
            )}
            {method.type === "bank" && (
              <>
                <h1 className='text-2xl font-bold text-black'>{method.details.bankAccountNumber}</h1>
                <p className='text-sm text-gray-500'>{method.details.bankName}</p>
              </>
            )}
            {method.type === "bitcoin" && (
              <h1 className='text-2xl font-bold text-black'>{method.details.bitcoinWallet}</h1>
            )}
          </div>
        ))
        )
    }

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