import React from 'react';
import TPODashboard from '../features/tpo/TPODashboard';
import Layout from '../shared/components/Layout';

const TpoPage: React.FC = () => {
  return (
    <Layout>
      <TPODashboard />
    </Layout>
  );
};

export default TpoPage;
