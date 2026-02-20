import React from 'react';
import StudentPortal from '../features/student/StudentPortal'; // Keeping old path for now until I confirm move
import Layout from '../shared/components/Layout';

const StudentPage: React.FC = () => {
  return (
    <Layout>
      <StudentPortal />
    </Layout>
  );
};

export default StudentPage;
