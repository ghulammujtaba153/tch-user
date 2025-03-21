import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, UsersIcon, FolderIcon, 
  CreditCardIcon, ChartPieIcon, BellIcon, CogIcon 
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/userContext';


interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  subItems?: { name: string; path: string; }[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    path: '/dashboard',
    subItems: [
      { name: 'Overview of Campaigns & Donations', path: '/dashboard/overview' },
      // { name: 'Key Performance Metrics', path: '/dashboard/metrics' }
    ]
  },
  {
    name: 'Users & Roles',
    icon: UsersIcon,
    path: '/users',
    subItems: [
      { name: 'Manage Users', path: '/users/manage/users' },
      { name: 'Manage Admins', path: '/users/manage/admins' },
      { name: 'Access Control & Permissions', path: '/users/permissions' }
    ]
  },
  {
    name: 'Campaigns',
    icon: FolderIcon,
    path: '/campaigns',
    subItems: [
      { name: 'View Campaigns', path: '/campaigns/manage/all' },
      { name: 'Pending Campaigns', path: '/campaigns/manage/pending' },
      { name: 'Active Campaigns', path: '/campaigns/manage/active' },
      // { name: 'Monitor Campaign Performance', path: '/campaigns/performance' }
    ]
  },
  {
    name: 'Donations',
    icon: CreditCardIcon,
    path: '/donations',
    subItems: [
      // { name: 'View Donations', path: '/donations/settings' },
      { name: 'Transaction List', path: '/donations/settings/transactions' },
      { name: 'Payments', path: '/donations/settings/payments' },
      // { name: 'Payment Processing Settings', path: '/donations/settings' },
      { name: 'Receipt Logs', path: '/donations/settings/logs' }
    ]
  },
  {
    name: 'Reports & Analytics',
    icon: ChartPieIcon,
    path: '/reports',
    subItems: [
      { name: 'Campaign Performance', path: '/reports/campaign' },
      { name: 'Donor Insights', path: '/reports/donor' },
      { name: 'Custom Reports', path: '/reports/custom' }
    ]
  },
  {
    name: 'Notifications & Emails',
    icon: BellIcon,
    path: '/notifications',
    subItems: [
      { name: 'Notification Center', path: '/notifications/center' },
      { name: 'Email Management', path: '/notifications/emails' },
      { name: 'Email Templates', path: '/notifications/templates' }
    ]
  },
  {
    name: 'Settings',
    icon: CogIcon,
    path: '/settings',
    subItems: [
      { name: 'General Platform Settings', path: '/settings/general' },
      { name: 'Security Settings', path: '/settings/security' },
      { name: 'Integrations Settings', path: '/settings/integrations' }
    ]
  },
  {
    name: 'View Campaigns',
    icon: CogIcon,
    path: '/admin/campaigns',
    subItems: [
      { name: 'Create Campaign', path: '/admin/campaigns/create' },
    ]
    
  }
];

const Sidebar: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();
  const {logout} = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const toggleExpand = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout?.();
    navigate('/signin');
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          {menuItems.map((item) => (
            <li key={item.name} className="mb-1">
              <Link
                to={item.path}
                onClick={() => {
                  // e.preventDefault();
                  toggleExpand(item.name);
                }}
                className={`w-full px-4 py-2 flex items-center hover:bg-gray-800 transition-colors duration-200 ${
                  isActive(item.path) ? 'bg-gray-800' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
              
              {expandedItem === item.name && item.subItems && (
                <ul className="bg-gray-800 py-2">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`block px-12 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                          isActive(subItem.path) ? 'bg-gray-700 text-white' : ''
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-700 mr-3"></div>
          <div>
            {/* <p className="text-sm font-medium">Admin User</p> */}
            {/* <p className="text-xs text-gray-400">admin@example.com</p> */}
            <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-500">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 