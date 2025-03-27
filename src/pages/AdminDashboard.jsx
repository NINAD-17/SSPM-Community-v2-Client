import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import UserActivityStats from '../features/admin/components/UserActivityStats';
import InactiveUsersList from '../features/admin/components/InactiveUsersList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/layout/Navbar';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('inactive-users');
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Redirect non-admin users
    useEffect(() => {
        console.log("isAdmin: ", user);
        if (!user?.isAdmin) {
            navigate('/');
        }
    }, [user, navigate]);

    // Demo data - replace with actual API calls
    const stats = {
        totalOpportunities: 156,
        activeOpportunities: 89,
        totalUsers: 1234,
        totalApplications: 567,
        pendingReports: 12
    };

    const recentOpportunities = [
        { id: 1, title: 'Software Engineer Intern', status: 'active', date: '2024-03-15' },
        { id: 2, title: 'Data Science Workshop', status: 'pending', date: '2024-03-14' },
        { id: 3, title: 'UI/UX Design Contest', status: 'active', date: '2024-03-13' },
    ];

    const recentUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-03-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-03-14' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2024-03-13' },
    ];

    const reportedItems = [
        {
            id: 1,
            type: 'opportunity',
            itemTitle: 'Software Engineer Intern',
            reportedBy: 'user123@email.com',
            reason: 'Misleading information',
            date: '2024-03-15',
            status: 'pending',
            description: 'The job description contains incorrect salary information'
        },
        {
            id: 2,
            type: 'user',
            itemTitle: 'John Smith',
            reportedBy: 'alice@email.com',
            reason: 'Harassment',
            date: '2024-03-14',
            status: 'pending',
            description: 'Sending inappropriate messages in comments'
        },
        {
            id: 3,
            type: 'application',
            itemTitle: 'Data Science Workshop',
            reportedBy: 'jane@email.com',
            reason: 'Spam',
            date: '2024-03-13',
            status: 'resolved',
            description: 'Multiple spam applications submitted'
        }
    ];

    // Render tab content based on active tab
    const renderTabContent = () => {
        switch(activeTab) {
            case 'inactive-users':
                return <InactiveUsersList />;
            case 'reports':
                return (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reported Content</h2>
                        <p className="text-gray-500">This feature is coming soon.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!user?.isAdmin) {
        return null; // Don't render anything while redirecting
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage platform users and content</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <span className="w-2 h-2 mr-1 bg-blue-500 rounded-full"></span>
                            Admin Access
                        </span>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="mb-8">
                    <UserActivityStats />
                </div>

                    {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex -mb-px space-x-6">
                        <TabButton
                            label="Inactive Users" 
                            isActive={activeTab === 'inactive-users'} 
                            onClick={() => setActiveTab('inactive-users')} 
                            icon="⏰"
                        />
                        <TabButton
                            label="Reported Content" 
                            isActive={activeTab === 'reports'} 
                            onClick={() => setActiveTab('reports')}
                            icon="⚠️"
                        />
                    </nav>
                    </div>

                {/* Tab Content */}
                <div className="mb-8">
                    {renderTabContent()}
                </div>

                {/* Toast notifications */}
                <ToastContainer position="bottom-right" />
            </div>
        </Layout>
    );
};

// Tab Button Component
const TabButton = ({ label, isActive, onClick, icon }) => (
    <button
        className={`group inline-flex items-center pb-4 px-1 font-medium text-sm focus:outline-none ${
            isActive 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
        }`}
        onClick={onClick}
    >
        <span className="mr-2">{icon}</span>
        {label}
    </button>
);

// Updated Helper Components
const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        indigo: 'from-indigo-500 to-indigo-600',
        purple: 'from-purple-500 to-purple-600',
        yellow: 'from-yellow-500 to-yellow-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">{title}</p>
                        <p className="text-2xl font-bold mt-2">{value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${colorClasses[color]}`}></div>
        </div>
    );
};

// Add these styles for tables
const tableStyles = {
    header: "bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
    cell: "px-6 py-4 whitespace-nowrap",
    row: "hover:bg-gray-50 transition-colors duration-200",
    button: "transition-colors duration-200",
    badge: "px-3 py-1 text-xs font-medium rounded-full"
};

export default AdminDashboard;
