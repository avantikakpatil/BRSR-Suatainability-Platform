import React from 'react';
import { useAuth } from '../../contexts/authContext';

const Home = () => {
    const { currentUser } = useAuth();
    const userName = currentUser?.displayName || currentUser?.email || 'User';

    return (
        <div className="bg-gray-100 min-h-screen p-8">

            {/* Dashboard Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Dashboard Cards */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-gray-700">Total Accounts</h3>
                    <p className="text-4xl font-bold text-green-500 mt-2">2,104</p>
                    <p className="text-sm text-gray-500">↑ 20% vs previous 30 days</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-gray-700">Orders per Month</h3>
                    <p className="text-4xl font-bold text-green-500 mt-2">37</p>
                    <p className="text-sm text-gray-500">↑ 15 vs previous 30 days</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-gray-700">Average Contract</h3>
                    <p className="text-4xl font-bold text-green-500 mt-2">$1,553</p>
                    <p className="text-sm text-gray-500">↑ 7.3% vs previous 30 days</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold text-gray-700">Growth Rate</h3>
                    <p className="text-4xl font-bold text-green-500 mt-2">8.29%</p>
                    <p className="text-sm text-gray-500">↑ 1.3% vs previous 30 days</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Growth by Market Segment</h3>
                    {/* Replace this placeholder with an actual chart component */}
                    <div className="h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                        <p className="text-gray-500">Chart Placeholder</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales per Rep</h3>
                    {/* Replace this placeholder with an actual chart component */}
                    <div className="h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                        <p className="text-gray-500">Chart Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
