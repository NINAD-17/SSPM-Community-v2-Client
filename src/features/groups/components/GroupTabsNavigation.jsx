import { useState } from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@headlessui/react';
import GroupMemberList from './GroupMemberList';
import GroupAdminList from './GroupAdminList';

const GroupTabsNavigation = ({ groupId, activeTab, onTabChange }) => {
    const [membersTab, setMembersTab] = useState('members'); // 'members' or 'admins'

    return (
        <div className="bg-white rounded-xl shadow">
            <Tab.Group selectedIndex={activeTab} onChange={onTabChange}>
                <Tab.List className="flex border-b">
                    <Tab className={({ selected }) => `
                        flex-1 py-3 text-sm font-medium text-center outline-none cursor-pointer transition-colors
                        ${selected 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }
                    `}>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="material-symbols-outlined text-[20px]">forum</span>
                            <span>Posts</span>
                        </div>
                    </Tab>
                    <Tab className={({ selected }) => `
                        flex-1 py-3 text-sm font-medium text-center outline-none cursor-pointer transition-colors
                        ${selected 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }
                    `}>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="material-symbols-outlined text-[20px]">group</span>
                            <span>Members</span>
                        </div>
                    </Tab>
                </Tab.List>

                <Tab.Panels>
                    <Tab.Panel></Tab.Panel>
                    
                    <Tab.Panel className="p-4">
                        <div className="mb-4">
                            <div className="flex rounded-lg border bg-gray-50 mb-4">
                                <button
                                    onClick={() => setMembersTab('members')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                                        membersTab === 'members' 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-500'
                                    }`}
                                >
                                    Members
                                </button>
                                <button
                                    onClick={() => setMembersTab('admins')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                                        membersTab === 'admins' 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-500'
                                    }`}
                                >
                                    Admins
                                </button>
                            </div>
                            
                            {membersTab === 'members' ? (
                                <GroupMemberList groupId={groupId} preview={false} />
                            ) : (
                                <GroupAdminList groupId={groupId} preview={false} />
                            )}
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

GroupTabsNavigation.propTypes = {
    groupId: PropTypes.string.isRequired,
    activeTab: PropTypes.number.isRequired,
    onTabChange: PropTypes.func.isRequired
};

export default GroupTabsNavigation;