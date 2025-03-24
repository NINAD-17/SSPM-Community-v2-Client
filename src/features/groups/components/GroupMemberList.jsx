import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { loadGroupMembers } from '../groupsSlice';
import Spinner from '../../../components/common/Spinner';
import UserCard from './UserCard';
import InfiniteScroll from 'react-infinite-scroll-component';

const GroupMemberList = ({ groupId, preview = false }) => {
    const dispatch = useDispatch();
    const { 
        currentGroup: { 
            members: { 
                items, 
                status, 
                error, 
                lastMemberId, 
                fetchCount, 
                allFetched 
            } 
        } 
    } = useSelector(state => state.groups);
    
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (groupId && items.length === 0 && status !== 'loading') {
            dispatch(loadGroupMembers({
                groupId,
                lastMemberId: null,
                limit: preview ? 5 : 10,
                fetchCount: 0
            }));
        }
    }, [dispatch, groupId, items.length, status, preview]);

    useEffect(() => {
        setHasMore(!allFetched);
    }, [allFetched]);

    const fetchMoreMembers = () => {
        if (allFetched || status === 'loading') return;
        
        dispatch(loadGroupMembers({
            groupId,
            lastMemberId,
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
        return <div className="text-gray-500 text-center py-4">No members found</div>;
    }

    // For preview mode, just show the first 5 members
    const displayedMembers = preview ? items.slice(0, 5) : items;

    return (
        <div>
            {!preview ? (
                <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreMembers}
                    hasMore={hasMore}
                    loader={<div className="flex justify-center py-4"><Spinner size="small" /></div>}
                    endMessage={
                        <p className="text-center text-gray-500 text-sm py-4">
                            All members loaded
                        </p>
                    }
                    className="space-y-3"
                >
                    {displayedMembers.map(member => (
                        <UserCard 
                            key={member._id}
                            user={{
                                _id: member.userId,
                                firstName: member.firstName,
                                lastName: member.lastName,
                                avatar: member.avatar,
                                role: member.role
                            }}
                            role={member.role}
                        />
                    ))}
                </InfiniteScroll>
            ) : (
                <div className="space-y-3">
                    {displayedMembers.map(member => (
                        <UserCard 
                            key={member._id}
                            user={{
                                _id: member.userId,
                                firstName: member.firstName,
                                lastName: member.lastName,
                                avatar: member.avatar,
                                role: member.role
                            }}
                            role={member.role}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

GroupMemberList.propTypes = {
    groupId: PropTypes.string.isRequired,
    preview: PropTypes.bool
};

export default GroupMemberList;