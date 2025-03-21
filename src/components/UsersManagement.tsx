import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BASE_URL } from '../config/url';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// Mock data for the charts
const userDistributionData = [
  { name: 'Admins', value: 5, color: '#0ea5e9' },
  { name: 'Campaign Creators', value: 25, color: '#22c55e' },
  { name: 'Donors', value: 70, color: '#f59e0b' },
];

const newUsersData = [
  { month: 'Jan', users: 45 },
  { month: 'Feb', users: 52 },
  { month: 'Mar', users: 48 },
  { month: 'Apr', users: 70 },
  { month: 'May', users: 65 },
  { month: 'Jun', users: 85 },
];

// Mock data for the users table
const usersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2024-02-27 14:30',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Campaign Creator',
    status: 'Active',
    lastActive: '2024-02-27 12:15',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Donor',
    status: 'Suspended',
    lastActive: '2024-02-25 09:45',
  },
  // Add more mock data as needed
];
const colors = ["#FF6384", "#36A2EB", "#FFCE56"];

const UsersManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('users');
  const location = useLocation();
  const [quickStats,setQuickStats]=useState<any>({})
  const [roleDistribution,setRoleDistribution]=useState<any>( )
  const [newUsers,setNewUsers]=useState<any>([])
  const [loading,setLoading]=useState<any>(true);
  const [users,setUsers]=useState<any>([])
  const [search,setSearch]=useState<any>("")
  const [role,setRole]=useState<any>("")

  const roles=  ["users", "admins", "permissions"]

  const pathname = location.pathname;
  useEffect(() => {
    console.log(pathname)
    const urlRole = pathname.split('/').pop();
    if (urlRole && roles.includes(urlRole)) {
      setSelectedTab(urlRole);
    }
  }, [pathname]);

  useEffect(()=>{
    const filteredUsers=users.filter((user:any)=>user.name.toLowerCase().includes(search.toLowerCase()))
    setUsers(filteredUsers)
  },[search])

  useEffect(()=>{
    const filteredUsers=users.filter((user:any)=>user.role.toLowerCase().includes(role.toLowerCase()))
    setUsers(filteredUsers)
  },[role])

  useEffect(()=>{
    const fetchUsers=async()=>{
      try{
      const res=await axios.get(`${BASE_URL}/analytics/users`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setQuickStats(res.data)
      console.log(res.data)

      const res2=await axios.get(`${BASE_URL}/analytics/users/roles`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      const roleDistribution = res2.data.activeUsersByRole.map((item:any) => ({
        name: item.role.charAt(0).toUpperCase() + item.role.slice(1), // Capitalize role names
        value: item.activeCount
    }));
      setRoleDistribution(roleDistribution)
      console.log(res2.data)

      const res3=await axios.get(`${BASE_URL}/analytics/users/trends`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setNewUsers(res3.data.trends)
      console.log(res3.data)

      const res4=await axios.get(`${BASE_URL}/analytics/users/all` ,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      setUsers(res4.data)
      console.log(res4.data)
      }catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    fetchUsers()
    
  },[])

  const handleDelete=async(id:any)=>{
    try{
      const res=await axios.delete(`${BASE_URL}/analytics/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
        })
      console.log(res.data)
      window.location.reload()

      setUsers(users.filter((user:any)=>user.id!==id))
    }catch(err){
      console.log(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Users & Roles Management</h1>
        <Link to={'/users/add'} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Add New User
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary-600">{quickStats.totalUsers}</p>
          <p className="text-sm text-gray-600 mt-2">+{quickStats.monthlyGrowth}% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">{quickStats.activeUsers}</p>
          <p className="text-sm text-gray-600 mt-2">+{quickStats.activeUsersPercentage}% of total users</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">New Sign-ups</h3>
          <p className="text-3xl font-bold text-blue-600">{quickStats.newSignups}</p>
          <p className="text-sm text-gray-600 mt-2">+{quickStats.monthlyGrowth}% from last month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">User Distribution by Role</h3>
          <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {roleDistribution?.map((entry :any, index :any) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
          </div>
        </div>


        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">New Users Over Time</h3>
          <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#0ea5e9" />
            </BarChart>
        </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User List
          </button>
          <button
            onClick={() => setSelectedTab('admins')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'admins'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Admin Management
          </button>
          <button
            onClick={() => setSelectedTab('permissions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'permissions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Role-Based Access Control
          </button>
        </nav>
      </div>

      {/* Users Table */}
      {selectedTab === 'users' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User List</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  onChange={(e)=>setSearch(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <select onChange={(e)=>setRole(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="creator">Campaign Creator</option>
                  <option value="donor">Donor</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Last Active</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user:any) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            user.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{dayjs(user.createdAt).format('DD-MM-YYYY')}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link to={`/users/edit/${user._id}`} className="text-primary-600 hover:text-primary-800">Edit</Link>
                          <button className="text-red-600 hover:text-red-800" onClick={()=>handleDelete(user._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing 1 to 10 of 100 entries
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
                <button className="px-3 py-1 border rounded bg-primary-600 text-white">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Management Section */}
      {selectedTab === 'admins' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Admin Management</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Super Admin Permissions</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked readOnly />
                    <span>Manage All Users</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked readOnly />
                    <span>Manage Campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked readOnly />
                    <span>Manage Donations</span>
                  </li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Regular Admin Permissions</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>View Users</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>Approve Campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Manage System Settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role-Based Access Control Section */}
      {selectedTab === 'permissions' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Role-Based Access Control</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Permission Matrix</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Permission</th>
                    <th className="text-center py-2 px-4">Super Admin</th>
                    <th className="text-center py-2 px-4">Admin</th>
                    <th className="text-center py-2 px-4">Campaign Creator</th>
                    <th className="text-center py-2 px-4">Donor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Manage Users</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Create Campaigns</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Make Donations</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement; 