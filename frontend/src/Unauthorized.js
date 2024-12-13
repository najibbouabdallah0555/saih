import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="flex w-full h-screen items-center justify-center bg-gray-100">
      <div className="p-4 max-w-md bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-4">You do not have permission to view this page.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;