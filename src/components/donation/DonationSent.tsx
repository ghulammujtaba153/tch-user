import { ArrowUpIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import Loading from '../Loading';

interface DonationSentProps {
  loading: boolean;
  error: any;
  donations: any[];
}

const DonationSent = ({ loading, error, donations }: DonationSentProps) => {
  if (loading) return <div className="flex justify-center items-center"><Loading /></div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-lg p-4">
      <h1 className="text-lg font-bold">Sent Donations</h1>

      {donations.length === 0 ? (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">No donations found</h1>
        </div>
      ) : (
        <div className="w-full max-h-[400px] overflow-y-auto flex flex-col gap-4">
          
          <div className="grid grid-cols-4 gap-2 px-2 py-1 text-xs font-semibold text-gray-500 border-b border-gray-200">
            <div className="col-span-2">Campaign</div>
            <div>Image</div>
            <div>Amount</div>
          </div>

          {donations.map((item: any) => (
            <div key={item.id} className="grid grid-cols-4 items-center gap-2 p-1 hover:bg-gray-50 rounded">
              
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex items-center justify-center bg-gray-100 rounded-full p-2">
                  <ArrowUpIcon className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold truncate">{item.campaignId?.title || 'Unknown Campaign'}</p>
                  <p className="text-xs text-gray-500">{dayjs(item.date).format('DD MMM YYYY')}</p>
                </div>
              </div>


              <div className="flex justify-center">
                <img
                  src={item.campaignId?.image || '/user.png'}
                  alt="campaign"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>


              <p className="text-sm font-semibold">
                R{new Intl.NumberFormat().format(item.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationSent;
