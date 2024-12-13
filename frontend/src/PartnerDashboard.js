import { Sidebar } from './partnerDashboardcontent';
import React from 'react';
import { Outlet } from 'react-router-dom';

function PartnerDashboard() {


  return (
    <div className="flex max-h-screen h-screen">
      <Sidebar />
        <div className="flex-1 bg-gray-100">
          {/* Render nested routes here */}
          <Outlet />
        </div>
      </div>
  );
}

export default PartnerDashboard;
