import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import AddPaymentModal from '../../components/dashboard/AddPaymentMethod';
import { toast } from 'react-toastify';
import BankAccount from '../../components/dashboard/BankAccount';
import { useAppConfig } from '../../context/AppConfigContext';

const Withdrawal = () => {
  const { user } = useContext(AuthContext)!;
  const [loading, setLoading] = useState<boolean>(true);
  const [withDrawModal, setWithDrawModal] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [apiLoading, setAPILoading] = useState<boolean>(false);
  const { config } = useAppConfig();
  const [requests, setRequests] = useState([]);


  useEffect(() => {
    if (config?.name) {
      document.title = `WithDrawal | ${config.name}`;
    }
  }, [config]);

  useEffect(() => {
    const fetchWithdrawalData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/donations/total/amount/${user.userId}`);
        const reqRes= await axios.get(`${BASE_URL}/requests/user/${user.userId}`);
        setRequests(reqRes.data);
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
    <div className='flex flex-col justify-between gap-8 md:gap-4 p-4 text-gray-500'>
      {/* Left Section - Withdrawal Form */}
      <div className='flex flex-col gap-4 flex-1'>
        <div className='flex flex-col gap-4 py-6 px-6 border border-gray-300 rounded-md'>
          <p className='text-sm text-gray-500'>Total Available Balance</p>
          <h1 className='text-2xl font-bold text-black'>R {amount}</h1>
        </div>

        <h1 className='text-2xl font-semibold text-secondary'>Withdrawal</h1>



        <button
          onClick={() => setWithDrawModal(true)}
          className='bg-secondary w-[100px] hover:scale-105 trnasition-transform duration-300 mx-auto text-sm text-white px-4 py-2 rounded-full'
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
            <h1 className='text-2xl font-semibold text-secondary'>Withdrawal</h1>
            <p className='text-sm text-gray-500'>Enter the amount you want to withdraw (ZAR)</p>
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
              className='bg-secondary max-w-fit mx-auto text-sm text-white px-4 py-2 rounded-full mt-4'
            >
              {
                apiLoading ? "Processing..." : "Withdraw"
              }
              
            </button>
          </div>
        </div>
      )}

      {/* Withdrawal Requests Table */}
      {requests.length > 0 && (
        <div className="mt-8 w-full">
          <h2 className="text-xl font-semibold text-secondary mb-2">Withdrawal Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Created At</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req: any) => (
                  <tr key={req._id} className="border-b">
                    <td className="px-4 py-2 text-sm text-gray-700">{req._id}</td>
                    <td className="px-4 py-2 text-sm text-green-700 font-semibold">R{req.amount}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdrawal;