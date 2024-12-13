import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Loader from './Loader';

function ProtectedRoute({ children, allowedRoles }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // Fetch and set the role
        }
      }
      setLoading(false);
    };
    checkUserRole();
  }, []);

  if (loading) return <div><Loader /></div>;

  // If role is not allowed, redirect
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === 'partner' ? '/HomepagePartner' : '/Unauthorized'} />;
  }

  return children;
}

export default ProtectedRoute;
