import React from 'react';
import Layout from '../components/layout/Layout';
import ManageEvents from '../features/events/components/ManageEvents';

const ManageEventsPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ManageEvents />
      </div>
    </Layout>
  );
};

export default ManageEventsPage; 