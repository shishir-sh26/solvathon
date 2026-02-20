import React from 'react';
import RecruiterDashboard from '../features/recruiter/components/RecruiterDashboard';
import Layout from '../shared/components/Layout';

const RecruiterPage: React.FC = () => {
  return (
    <Layout>
      <RecruiterDashboard />
    </Layout>
  );
};

export default RecruiterPage;
