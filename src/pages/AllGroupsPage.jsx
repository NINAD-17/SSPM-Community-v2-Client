import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { loadAllGroups, loadRecommendedGroups } from '../features/groups/groupsSlice';
import Layout from '../components/layout/Layout';
import Spinner from '../components/common/Spinner';
import CreateGroupModal from '../features/groups/components/CreateGroupModal';
import GroupCardList from '../features/groups/components/GroupCardList';
import RecommendedGroupsList from '../features/groups/components/RecommendedGroupsList';
import Footer from '../components/layout/Footer';

const AllGroupsPage = () => {
  const dispatch = useDispatch();
  const { 
    groupsList: { all, recommended, status, error }, 
  } = useSelector(state => state.groups);
  
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Initial data loading
  useEffect(() => {
    dispatch(loadAllGroups({ fetchCount: 0 }));
    dispatch(loadRecommendedGroups());
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!all.allFetched) {
      dispatch(loadAllGroups({
        lastId: all.lastId,
        fetchCount: all.fetchCount + 1
      }));
    }
  };

  const handleGroupCreated = () => {
    toast.success('Group created successfully!');
    dispatch(loadAllGroups({ fetchCount: 0 }));
    setShowCreateModal(false);
  };

  if (status === 'loading' && all.items.length === 0 && recommended.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-blue-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header with create button */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Groups</h1>
              <p className="text-gray-600">Connect with communities that share your interests</p>
            </div>
            
            <div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Create Group</span>
              </button>
            </div>
          </div>

          {/* Error message if applicable */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
              <button 
                onClick={() => {
                  dispatch(loadAllGroups({ fetchCount: 0 }));
                  dispatch(loadRecommendedGroups());
                }}
                className="mt-2 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Recommended Groups Section */}
          {recommended && recommended.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended for you</h2>
              <RecommendedGroupsList groups={recommended} />
            </div>
          )}

          {/* All Groups Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Groups</h2>
            
            {/* Loading skeleton */}
            {status === 'loading' && all.items.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-t-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : all.items.length > 0 ? (
              <>
                <GroupCardList groups={all.items} />
                
                {/* Load more button */}
                {!all.allFetched && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={status === 'loading'}
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center shadow-md">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No groups found</h3>
                <p className="text-gray-500 mb-6">
                  There are no groups available at the moment
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create a Group
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12">
            <Footer />
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </Layout>
  );
};

export default AllGroupsPage; 