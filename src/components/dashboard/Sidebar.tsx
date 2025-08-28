import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon, SpeakerWaveIcon, CurrencyDollarIcon, UsersIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/userContext';
import { useAppConfig } from '../../context/AppConfigContext';

interface SubSubItem {
  name: string;
  path: string;
}

interface SubItem {
  name: string;
  path: string;
  icon?: React.ElementType;
  subItems?: SubSubItem[];
}

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  {
    name: 'My Profile',
    icon: UsersIcon,
    path: '/user/dashboard/profile',
  },
  // {
  //   name: 'Dashboard',
  //   icon: HomeIcon,
  //   path: '/user/dashboard/overview',
  // },
  {
    name: 'My Donations',
    icon: CurrencyDollarIcon,
    path: '/user/dashboard/sent-donations',
  },
  {
    name: 'Organisation',
    icon: BuildingOfficeIcon,
    path: '/user/dashboard/overview',
    subItems: [
      
      {
        name: 'Organisation Setup',
        path: '#',
        subItems: [
          {
            name: 'Organisation Details',
            path: '/user/dashboard/organization',
          },
          {
            name: 'Bank Details',
            path: '/user/dashboard/bank-details',
          },
          {
            name: 'S18A Document',
            path: '/user/dashboard/s18a-document',
          },
          {
            name: 'Verification Document',
            path: '/user/dashboard/verification-document',
          },
          {
            name: 'Members',
            path: '/user/dashboard/members',
          },
          
        ]
      },

      {
        name: 'Campaigns',
        icon: SpeakerWaveIcon,
        path: '/user/dashboard/campaigns',
      },
      {
        name: 'Donations',
        path: '/user/dashboard/received-donations',
      },
      {
            name: "Withdrawal",
            path: "/user/dashboard/withdrawal",
            icon: CurrencyDollarIcon,}
      
      
    ]
  },
  
  {
    name: "Need Help",
    icon: UsersIcon,
    path: '/user/dashboard/support',
    subItems: [
      {
        name: "FAQs",
        path: "/user/dashboard/faqs",
      },
      {
        name: "Guides",
        path: "/user/dashboard/guides",
      },
      {
        name: 'Support',
        icon: UsersIcon,
        path: '/user/dashboard/support',
      }
    ]
  }
];

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedSubItem, setExpandedSubItem] = useState<string | null>(null);
  const location = useLocation();
  const { logout, user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const { config } = useAppConfig();

  // ✅ Check role condition
  const canShowMembers =
    !user?.organization?.role || user?.organization?.role === "owner";

  // ✅ Clone & filter menuItems dynamically
  const filteredMenuItems = menuItems.map(item => {
    if (item.name === "Organization" && item.subItems) {
      return {
        ...item,
        subItems: item.subItems
          .map(subItem => {
            // Filter sub-subItems inside "Organization Setup"
            if (subItem.name === "Organization Setup" && subItem.subItems) {
              return {
                ...subItem,
                subItems: subItem.subItems.filter(subSubItem => {
                  if (
                    subSubItem.name === "S18A Document" ||
                    subSubItem.name === "Bank Details"
                  ) {
                    return canShowMembers;
                  }
                  return true;
                }),
              };
            }

            // Filter direct subItems like "Members"
            if (subItem.name === "Members") {
              return canShowMembers ? subItem : null;
            }

            return subItem;
          })
          .filter(Boolean) as SubItem[],
      };
    }
    return item;
  });

  const toggleExpand = (itemName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItem(expandedItem === itemName ? null : itemName);
    if (expandedItem !== itemName) {
      setExpandedSubItem(null);
    }
  };

  const toggleSubExpand = (subItemName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedSubItem(expandedSubItem === subItemName ? null : subItemName);
  };

  const isActive = (path: string) => {
    if (path === '#') return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const isSubItemActive = (subItems: SubItem[]): boolean => {
    return subItems.some(subItem => {
      if (subItem.subItems) {
        return subItem.subItems.some(subSubItem => isActive(subSubItem.path));
      }
      return isActive(subItem.path);
    });
  };

  const handleLogout = () => {
    logout?.();
    navigate('/signin');
  };

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    if (path === '#') {
      e.preventDefault();
    }
  };

  return (
    <div className={`relative hidden sm:block h-screen bg-gray-50 text-gray-800 flex flex-col transition-all duration-300 ${isOpen ? 'md:w-64' : 'w-16'}`}>
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center p-4">
          <img 
            src={config?.logo} 
            alt="logo" 
            className={`w-30 h-10 ${isOpen ? 'block' : 'hidden'}`} 
          />
        </Link>

        {/* Menu Items */}
        <nav className="flex-1 flex flex-col items-center w-full overflow-y-auto max-h-[calc(100vh-120px)]">
          <ul className="py-4 w-full flex flex-col items-center">
            {filteredMenuItems.map((item) => (
              <li key={item.name} className="mb-1 w-full flex justify-center items-center">
                <div className="w-full">
                  <div className="relative">
                    <Link
                      to={item.path}
                      onClick={(e) => handleLinkClick(item.path, e)}
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
                        <div key={subItem.name}>
                          <Link
                            to={subItem.path}
                            onClick={(e) => handleLinkClick(subItem.path, e)}
                            className={`flex items-center justify-between px-12 py-3 text-sm hover:bg-secondary/10 transition-colors duration-200 ${
                              isActive(subItem.path) || (subItem.subItems && subItem.subItems.some(subSubItem => isActive(subSubItem.path)))
                                ? 'bg-secondary/20 text-secondary font-medium' 
                                : 'text-gray-600'
                            }`}
                          >
                            <span>{subItem.name}</span>
                            {subItem.subItems && (
                              <button
                                onClick={(e) => toggleSubExpand(subItem.name, e)}
                                className="p-1 hover:bg-secondary/30 rounded"
                              >
                                {expandedSubItem === subItem.name ? (
                                  <ChevronUpIcon className="h-3 w-3" />
                                ) : (
                                  <ChevronDownIcon className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </Link>

                          {/* Sub-submenu */}
                          {expandedSubItem === subItem.name && subItem.subItems && (
                            <div className="bg-gray-100 border-l-4 border-secondary/20">
                              {subItem.subItems.map((subSubItem) => (
                                <Link
                                  key={subSubItem.name}
                                  to={subSubItem.path}
                                  className={`block px-16 py-2 text-xs hover:bg-secondary/10 transition-colors duration-200 ${
                                    isActive(subSubItem.path)
                                      ? 'bg-secondary/20 text-secondary font-medium'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {subSubItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
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
