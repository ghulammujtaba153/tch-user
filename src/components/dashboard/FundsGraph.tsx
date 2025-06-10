import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { AuthContext } from '../../context/userContext';
import { BASE_URL } from '../../config/url';
import axios from 'axios';

// Format data based on range and selected year
const formatData = (data: any, range: any, year: any) => {
    const groupedData: any = {};

    data.forEach((item: any) => {
        const date = new Date(item.date);
        const itemYear = date.getFullYear().toString();

        if (year !== 'all' && itemYear !== year) return;

        let key = '';
        if (range === 'yearly') {
            key = itemYear;
        } else if (range === 'monthly') {
            key = `${itemYear}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        } else if (range === 'weekly') {
            const week = Math.ceil(date.getDate() / 7);
            key = `${itemYear}-W${week}`;
        } else if (range === 'daily') {
            key = date.toISOString().split('T')[0];
        }

        groupedData[key] = (groupedData[key] || 0) + item.amount;
    });

    return Object.entries(groupedData).map(([key, amount]) => ({ date: key, amount }));
};

const FundsGraph = () => {
    const [selectedRange, setSelectedRange] = useState('daily');
    const [selectedYear, setSelectedYear] = useState('all');

    const [data, setData] = useState([]);
    const { user } = useContext(AuthContext) || {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.organization?.role== "owner") {
                    const res= await axios.get(`${BASE_URL}/analytics/campaigner/organization/latest-donations/${user?.organization?._id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                    setData(res.data);
                    return;
                }

                const res = await axios.get(`${BASE_URL}/analytics/campaigner/latest-donations/${user?.userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setData(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (user?.userId) fetchData();
    }, [user]);

    const availableYears = useMemo(() => {
        const years = new Set(data.map((item: any) => new Date(item.date).getFullYear().toString()));
        return Array.from(years).sort();
    }, [data]);

    const processedData = useMemo(() => formatData(data, selectedRange, selectedYear), [data, selectedRange, selectedYear]);

    return (
        <div className='px-4 py-6 border bg-white shadow-lg border-gray-200 rounded-lg'>
            <div className='flex md:flex-row flex-col justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>Funds Raised Over Time</h2>

                <div className='flex items-center gap-4'>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className='border border-gray-300 rounded px-3 py-1'
                    >
                        <option value="all">All Years</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className='border border-gray-300 rounded px-3 py-1'
                    >
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processedData}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#4CAF50" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FundsGraph;
