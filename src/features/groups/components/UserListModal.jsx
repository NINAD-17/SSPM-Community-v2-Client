import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import defaultAvatar from '../../../assets/user.png';
import { useNavigate } from 'react-router-dom';

const UserListModal = ({ isOpen, onClose, title, users, type }) => {
    const navigate = useNavigate();

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
        onClose();
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-[51]">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                </Transition.Child>
                
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white rounded-xl w-full max-w-md shadow-xl">
                            {/* Header */}
                            <div className="p-4 border-b flex items-center justify-between">
                                <Dialog.Title className="text-lg font-semibold">
                                    {title} ({users.length})
                                </Dialog.Title>
                                <button 
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {/* Users List */}
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {users.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => handleUserClick(user._id)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <img
                                            src={user.avatar || defaultAvatar}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {user.headline || (type === 'admin' ? 'Group Admin' : 'Member')}
                                            </p>
                                        </div>
                                        {type === 'admin' && (
                                            <span className="text-blue-600 text-sm font-medium">Admin</span>
                                        )}
                                    </div>
                                ))}

                                {users.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No {type === 'admin' ? 'admins' : 'members'} to display
                                    </div>
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

UserListModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        headline: PropTypes.string
    })).isRequired,
    type: PropTypes.oneOf(['admin', 'member']).isRequired
};

export default UserListModal; 