import { ArrowDownIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import Loading from '../Loading';

interface DonationsProps {
  loading: boolean;
  error: any;
  donations: any[];
}

const Donations = ({ loading, error, donations }: DonationsProps) => {
  if (loading) return <div className="flex justify-center items-center"><Loading /></div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleDownloadCSV = () => {
    const headers = ['Donor', 'Date', 'Campaign', 'Amount'];
    const rows = donations.map((item) => [
      `"${item.anonymous ? 'Anonymous' : item.userName}"`,
      `"${dayjs(item.date).format('YYYY-MM-DD')}"`,
      `"${item.campaignName}"`,
      item.amount,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'donations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-lg p-4">
      <div className='flex items-center sm:flex-row flex-col gap-2 justify-between'>
        <h1 className="text-lg font-bold">Received Donations</h1>
        <button
          onClick={handleDownloadCSV}
          className='bg-secondary text-white px-4 py-2 rounded-full hover:bg-[#B42318]/80 flex items-center gap-2'
        >
          Download Reports
          <ArrowDownIcon className='w-4 h-4' />
        </button>
      </div>

      {donations.length === 0 ? (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">No donations found</h1>
        </div>
      ) : (
        <div className="w-full max-h-[400px] overflow-y-auto flex flex-col gap-4">
          {/* Header row */}
          <div className="grid grid-cols-6 gap-2 px-2 py-1 text-xs font-semibold text-gray-500 border-b border-gray-200">
            <div className="col-span-2">Donor</div>
            <div className="col-span-2">Campaign</div>
            <div>Avatar</div>
            <div>Amount</div>
          </div>

          {donations.map((item: any) => (
            <div key={item.id} className="grid grid-cols-6 items-center gap-2 p-1 hover:bg-gray-50 rounded">
              {/* Donor Info */}
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex items-center justify-center bg-gray-100 rounded-full p-2">
                  <ArrowDownIcon className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold truncate">{item.anonymous ? 'Anonymous' : item.userName}</p>
                  <p className="text-xs text-gray-500">{dayjs(item.date).format('DD MMM YYYY')}</p>
                </div>
              </div>

              {/* Campaign Name */}
              <div className="col-span-2">
                <p className="text-sm truncate">{item.campaignName}</p>
              </div>

              {/* Avatar */}
              <div className="flex justify-center">
                <img
                  src={item.user?.profilePicture || '/user.png'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>

              {/* Amount */}
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

export default Donations;
