import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon, SpeakerWaveIcon, CurrencyDollarIcon, UsersIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/userContext';

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  subItems?: { name: string; path: string; }[];
}

const menuItems: MenuItem[] = [
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
    name: 'Donations',
    icon: CurrencyDollarIcon,
    path: '/user/dashboard/donations',
  },
  {
    name: 'Profile',
    icon: UsersIcon,
    path: '/user/dashboard/profile',
  }
];

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();
  const { logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const toggleExpand = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  const isActive = (path: string) => {
    // Check if the current route starts with the path of the menu item
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout?.();
    navigate('/signin');
  };

  return (
    <div className={`relative hidden sm:block h-screen  bg-white text-gray-800 flex flex-col transition-all duration-300 ${isOpen ? 'md:w-64' : 'w-16'}`}>
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center p-4">
          <img src={"/nav-logo.png"} alt="logo" className={`w-30 h-10 ${isOpen ? 'block' : 'hidden'}`} />
        </Link>

        {/* Menu Items */}
        <nav className="flex-1 flex flex-col items-center w-full overflow-y-auto">
          <ul className="py-4 w-full flex flex-col items-center">
            {menuItems.map((item) => (
              <li key={item.name} className="mb-1 w-full flex justify-center items-center">
                <Link
                  to={item.path}
                  onClick={(e) => toggleExpand(item.name)}
                  className={`w-full ${isOpen ? "px-6 py-4" : "px-5 py-5"} flex items-center hover:bg-secondary/20 transition-colors duration-200 ${isActive(item.path) ? 'bg-secondary/20 border-l-4 text-secondary border-secondary' : ''}`}
                >
                  <item.icon className={`${isOpen ? 'h-6 w-6' : 'h-8 w-8'}`} />
                  {isOpen && (
                    <span className={`ml-3`}>{item.name}</span>
                  )}
                </Link>

                {expandedItem === item.name && item.subItems && isOpen && (
                  <ul className="bg-gray-800 py-2">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`block px-12 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${isActive(subItem.path) ? 'bg-gray-700 text-white' : ''}`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {/* Logout Button */}
            <div className="p-2 w-full">
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className={`text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-full ${isOpen ? 'w-full' : 'w-20 justify-center'}`}
                >
                  <ArrowRightStartOnRectangleIcon className={`${isOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
                  {isOpen && (
                    <span className={`pl-2`}>Logout</span>
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
        className="absolute top-4 -right-2 p-2 bg-secondary/80 text-white rounded-full"
      >
        {isOpen ? <ChevronLeftIcon className="h-5 w-5" />  : <ChevronRightIcon className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default Sidebar;