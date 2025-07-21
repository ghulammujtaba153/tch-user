import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon, SpeakerWaveIcon, CurrencyDollarIcon, UsersIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/userContext';
import { useAppConfig } from '../../context/AppConfigContext';

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  subItems?: { name: string; path: string; }[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Profile',
    icon: UsersIcon,
    path: '/user/dashboard/profile',
  },
  {
    name: 'My Donations',
    icon: CurrencyDollarIcon,
    path: '/user/dashboard/sent-donations',
  },
  {
    name: 'Organization',
    icon: HomeIcon,
    path: '/user/dashboard/organization',
    subItems: [
      {
        name: 'Bank Details',
        path: '/user/dashboard/bank-details',
      },
      {
        name: 'S18A Document',
        path: '/user/dashboard/s18a-document',
      },
      {
        name: 'Members',
        path: '/user/dashboard/members',
      },
      {
        name: 'Donations',
        path: '/user/dashboard/received-donations',
      },
    ]
  },
  {
    name: 'Overview',
    icon: HomeIcon,
    path: '/user/dashboard/overview',
  },
  {
    name: 'Campaigns',
    icon: SpeakerWaveIcon,
    path: '/user/dashboard/campaigns',
  },
  
  {
    name: 'Support',
    icon: UsersIcon,
    path: '/user/dashboard/support',
  }
];

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();
  const { logout, user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const {config} = useAppConfig();
  



  const toggleExpand = (itemName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const isSubItemActive = (subItems: { name: string; path: string; }[]) => {
    return subItems.some(subItem => isActive(subItem.path));
  };

  const handleLogout = () => {
    logout?.();
    navigate('/signin');
  };

  return (
    <div className={`relative hidden sm:block h-screen bg-gray-50 text-gray-800 flex flex-col transition-all duration-300 ${isOpen ? 'md:w-64' : 'w-16'}`}>
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center p-4">
          <img src={config?.logo} alt="logo" className={`w-30 h-10 ${isOpen ? 'block' : 'hidden'}`} />
        </Link>

        {/* Menu Items */}
        <nav className="flex-1 flex flex-col items-center w-full overflow-y-auto">
          <ul className="py-4 w-full flex flex-col items-center">
            {menuItems.map((item) => (
              <li key={item.name} className="mb-1 w-full flex justify-center items-center">
                <div className="w-full">
                  <div className="relative">
                    <Link
                      to={item.path}
                      className={`w-full ${isOpen ? "px-6 py-4" : "px-5 py-5"} flex items-center hover:bg-secondary/20 transition-colors duration-200 ${
                        isActive(item.path) || (item.subItems && isSubItemActive(item.subItems)) 
                          ? 'bg-secondary/20 border-l-4 text-secondary border-secondary' 
                          : ''
                      }`}
                    >
                      <item.icon className={`${isOpen ? 'h-6 w-6' : 'h-8 w-8'}`} />
                      {isOpen && (
                        <>
                          <span className="ml-3 flex-1">{item.name}</span>
                          {item.subItems && (
                            <button
                              onClick={(e) => toggleExpand(item.name, e)}
                              className="p-1 hover:bg-secondary/30 rounded"
                            >
                              {expandedItem === item.name ? (
                                <ChevronUpIcon className="h-4 w-4" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </Link>
                  </div>

                  {/* Submenu */}
                  {expandedItem === item.name && item.subItems && isOpen && (
                    <div className="bg-gray-50 border-l-4 border-secondary/30">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`block px-12 py-3 text-sm hover:bg-secondary/10 transition-colors duration-200 ${
                            isActive(subItem.path) 
                              ? 'bg-secondary/20 text-secondary font-medium' 
                              : 'text-gray-600'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}

            {/* Logout Button */}
            <div className="p-2 w-full">
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className={`text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors duration-200 ${isOpen ? 'w-full' : 'w-20 justify-center'}`}
                >
                  <ArrowRightStartOnRectangleIcon className={`${isOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
                  {isOpen && (
                    <span className="pl-2">Logout</span>
                  )}
                </button>
              </div>
            </div>
          </ul>
        </nav>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-2 p-2 bg-secondary/80 text-white rounded-full hover:bg-secondary transition-colors duration-200"
      >
        {isOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default Sidebar;