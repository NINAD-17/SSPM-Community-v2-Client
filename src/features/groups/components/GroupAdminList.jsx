import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { loadGroupAdmins } from '../groupsSlice';
import Spinner from '../../../components/common/Spinner';
import UserCard from './UserCard';
import InfiniteScroll from 'react-infinite-scroll-component';

const GroupAdminList = ({ groupId, preview = false }) => {
    const dispatch = useDispatch();
    const { 
        currentGroup: { 
            admins: { 
                items, 
                status, 
                error, 
                lastAdminId, 
                fetchCount, 
                allFetched 
            } 
        } 
    } = useSelector(state => state.groups);
    
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (groupId && items.length === 0 && status !== 'loading') {
            dispatch(loadGroupAdmins({
                groupId,
                lastAdminId: null,
                limit: preview ? 5 : 10,
                fetchCount: 0
            }));
        }
    }, [dispatch, groupId, items.length, status, preview]);

    useEffect(() => {
        setHasMore(!allFetched);
    }, [allFetched]);

    const fetchMoreAdmins = () => {
        if (allFetched || status === 'loading') return;
        
        dispatch(loadGroupAdmins({
            groupId,
            lastAdminId,
            limit: 10,
            fetchCount: fetchCount + 1
        }));
    };

    if (status === 'loading' && items.length === 0) {
        return <div className="flex justify-center py-4"><Spinner size="medium" /></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }

    if (items.length === 0) {
        return <div className="text-gray-500 text-center py-4">No admins found</div>;
    }

    // For preview mode, just show the first 5 admins
    const displayedAdmins = preview ? items.slice(0, 5) : items;

    return (
        <div>
            {!preview ? (
                <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreAdmins}
                    hasMore={hasMore}
                    loader={<div className="flex justify-center py-4"><Spinner size="small" /></div>}
                    endMessage={
                        <p className="text-center text-gray-500 text-sm py-4">
                            All admins loaded
                        </p>
                    }
                    className="space-y-3"
                >
                    {displayedAdmins.map(admin => (
                        <UserCard 
                            key={admin._id}
                            user={{
                                _id: admin.userId,
                                firstName: admin.firstName,
                                lastName: admin.lastName,
                                avatar: admin.avatar,
                                role: admin.role
                            }}
                            role="admin"
                        />
                    ))}
                </InfiniteScroll>
            ) : (
                <div className="space-y-3">
                    {displayedAdmins.map(admin => (
                        <UserCard 
                            key={admin._id}
                            user={{
                                _id: admin.userId,
                                firstName: admin.firstName,
                                lastName: admin.lastName,
                                avatar: admin.avatar,
                                role: admin.role
                            }}
                            role="admin"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

GroupAdminList.propTypes = {
    groupId: PropTypes.string.isRequired,
    preview: PropTypes.bool
};

export default GroupAdminList;