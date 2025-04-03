// import React, { useEffect, useState } from 'react';
// import {
//   Cog6ToothIcon,
//   ShieldCheckIcon,
//   PuzzlePieceIcon,
//   ArrowPathIcon,
//   CloudArrowUpIcon,
  
//   BanknotesIcon,
//   EnvelopeIcon,
// } from '@heroicons/react/24/outline';
// import { useLocation } from 'react-router-dom';

// // Mock data for access logs
// const accessLogsData = [
//   {
//     id: 1,
//     user: 'Admin User',
//     action: 'Updated Payment Gateway Settings',
//     timestamp: '2024-02-27 14:30:00',
//     ip: '192.168.1.100',
//   },
//   {
//     id: 2,
//     user: 'System',
//     action: 'Automated Backup Created',
//     timestamp: '2024-02-27 12:00:00',
//     ip: 'System',
//   },
//   {
//     id: 3,
//     user: 'Admin User',
//     action: 'Changed Password Policy',
//     timestamp: '2024-02-27 10:15:00',
//     ip: '192.168.1.100',
//   },
// ];

// // Mock data for integrations
// const integrationsData = [
//   {
//     id: 1,
//     name: 'Stripe',
//     type: 'Payment Gateway',
//     status: 'Connected',
//     lastSync: '2024-02-27 14:00:00',
//     icon: BanknotesIcon,
//   },
//   {
//     id: 2,
//     name: 'PayPal',
//     type: 'Payment Gateway',
//     status: 'Connected',
//     lastSync: '2024-02-27 13:45:00',
//     icon: BanknotesIcon,
//   },
//   {
//     id: 3,
//     name: 'SendGrid',
//     type: 'Email Provider',
//     status: 'Connected',
//     lastSync: '2024-02-27 13:30:00',
//     icon: EnvelopeIcon,
//   },
// ];

// const Settings: React.FC = () => {
//   const [selectedTab, setSelectedTab] = useState('general');
//   const [isBackupInProgress, setIsBackupInProgress] = useState(false);
//   const location = useLocation();
//   const pathname = location.pathname;
//   const roles=  ["general", "security", "integrations"]

//   useEffect(() => {
//     const urlRole = pathname.split('/').pop();
//     if (urlRole && roles.includes(urlRole)) {
//       setSelectedTab(urlRole);
//     }
//   }, [pathname]);

//   const handleBackup = () => {
//     setIsBackupInProgress(true);
//     // Simulate backup process
//     setTimeout(() => {
//       setIsBackupInProgress(false);
//     }, 2000);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
//         <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
//           Save Changes
//         </button>
//       </div>

//       {/* Tab Navigation */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-8">
//           <button
//             onClick={() => setSelectedTab('general')}
//             className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
//               selectedTab === 'general'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <Cog6ToothIcon className="h-5 w-5 mr-2" />
//             General Settings
//           </button>
//           <button
//             onClick={() => setSelectedTab('security')}
//             className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
//               selectedTab === 'security'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <ShieldCheckIcon className="h-5 w-5 mr-2" />
//             Security
//           </button>
//           <button
//             onClick={() => setSelectedTab('integrations')}
//             className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
//               selectedTab === 'integrations'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <PuzzlePieceIcon className="h-5 w-5 mr-2" />
//             Integrations
//           </button>
//         </nav>
//       </div>

//       {/* General Settings Tab */}
//       {selectedTab === 'general' && (
//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">Platform Configuration</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Platform Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   defaultValue="TCH Crowdfunding"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Platform Logo
//                 </label>
//                 <div className="flex items-center space-x-4">
//                   <div className="h-16 w-16 bg-gray-100 rounded-lg"></div>
//                   <button className="text-primary-600 hover:text-primary-800">
//                     Change Logo
//                   </button>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Default Currency
//                   </label>
//                   <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
//                     <option value="USD">USD ($)</option>
//                     <option value="EUR">EUR (€)</option>
//                     <option value="GBP">GBP (£)</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Time Zone
//                   </label>
//                   <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
//                     <option value="UTC">UTC</option>
//                     <option value="EST">Eastern Time</option>
//                     <option value="PST">Pacific Time</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">Backup & Restore</h2>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">Automated Backups</p>
//                   <p className="text-sm text-gray-600">Daily backups at midnight UTC</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input type="checkbox" className="sr-only peer" checked />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                 </label>
//               </div>
//               <div className="flex space-x-4">
//                 <button
//                   onClick={handleBackup}
//                   className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//                   disabled={isBackupInProgress}
//                 >
//                   {isBackupInProgress ? (
//                     <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
//                   ) : (
//                     <CloudArrowUpIcon className="h-5 w-5 mr-2" />
//                   )}
//                   {isBackupInProgress ? 'Backing up...' : 'Create Backup'}
//                 </button>
//                 <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                   Restore from Backup
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Security Settings Tab */}
//       {selectedTab === 'security' && (
//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">Authentication Settings</h2>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">Two-Factor Authentication</p>
//                   <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input type="checkbox" className="sr-only peer" checked />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                 </label>
//               </div>
//               <div>
//                 <p className="font-medium mb-2">Password Policy</p>
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <input type="checkbox" className="mr-2" checked />
//                     <span className="text-sm">Minimum 8 characters</span>
//                   </div>
//                   <div className="flex items-center">
//                     <input type="checkbox" className="mr-2" checked />
//                     <span className="text-sm">Require uppercase letters</span>
//                   </div>
//                   <div className="flex items-center">
//                     <input type="checkbox" className="mr-2" checked />
//                     <span className="text-sm">Require numbers</span>
//                   </div>
//                   <div className="flex items-center">
//                     <input type="checkbox" className="mr-2" checked />
//                     <span className="text-sm">Require special characters</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">Access Logs</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left py-3 px-4">User</th>
//                     <th className="text-left py-3 px-4">Action</th>
//                     <th className="text-left py-3 px-4">Timestamp</th>
//                     <th className="text-left py-3 px-4">IP Address</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {accessLogsData.map((log) => (
//                     <tr key={log.id} className="border-b">
//                       <td className="py-3 px-4">{log.user}</td>
//                       <td className="py-3 px-4">{log.action}</td>
//                       <td className="py-3 px-4">{log.timestamp}</td>
//                       <td className="py-3 px-4">{log.ip}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Integrations Tab */}
//       {selectedTab === 'integrations' && (
//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">Connected Services</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {integrationsData.map((integration) => (
//                 <div key={integration.id} className="border rounded-lg p-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center">
//                       <integration.icon className="h-8 w-8 text-gray-600 mr-3" />
//                       <div>
//                         <h3 className="font-semibold">{integration.name}</h3>
//                         <p className="text-sm text-gray-600">{integration.type}</p>
//                       </div>
//                     </div>
//                     <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                       {integration.status}
//                     </span>
//                   </div>
//                   <div className="mt-4">
//                     <p className="text-xs text-gray-500">Last synced: {integration.lastSync}</p>
//                   </div>
//                   <div className="mt-4 flex justify-end space-x-2">
//                     <button className="text-primary-600 hover:text-primary-800 text-sm">
//                       Configure
//                     </button>
//                     <button className="text-red-600 hover:text-red-800 text-sm">
//                       Disconnect
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               <div className="border rounded-lg p-4 border-dashed flex items-center justify-center">
//                 <button className="text-primary-600 hover:text-primary-800 flex items-center">
//                   <PuzzlePieceIcon className="h-5 w-5 mr-2" />
//                   Add New Integration
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   API Key
//                 </label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="password"
//                     className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     value="••••••••••••••••"
//                     readOnly
//                   />
//                   <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
//                     Generate New
//                   </button>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Webhook URL
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   defaultValue="https://api.example.com/webhook"
//                 />
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">API Rate Limiting</p>
//                   <p className="text-sm text-gray-600">Limit API requests per minute</p>
//                 </div>
//                 <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
//                   <option value="60">60 requests/min</option>
//                   <option value="100">100 requests/min</option>
//                   <option value="200">200 requests/min</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Settings; 