import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import GroupMemberList from './GroupMemberList';
import GroupAdminList from './GroupAdminList';

const UserListModal = ({ isOpen, onClose, title, groupId, type }) => {
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
                        <Dialog.Panel className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl">
                            <div className="flex justify-between items-center border-b border-gray-200 p-4">
                                <Dialog.Title className="text-xl font-bold text-gray-800">
                                    {title}
                                </Dialog.Title>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            
                            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 4rem)' }}>
                                {type === 'member' ? (
                                    <GroupMemberList groupId={groupId} preview={false} />
                                ) : (
                                    <GroupAdminList groupId={groupId} preview={false} />
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
    groupId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['member', 'admin']).isRequired
};

export default UserListModal;