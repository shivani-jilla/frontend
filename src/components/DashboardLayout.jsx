import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div className="container-fluid max-w-7xl px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
