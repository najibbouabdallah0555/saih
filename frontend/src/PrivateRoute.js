import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import Loader from './Loader';

const PrivateRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // Fetch user role from Firestore
        }
      }
      setLoading(false);
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUserRole();
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <div><Loader /></div>;

  // If the user is logged in but their role is not allowed, redirect to Unauthorized
  if (!allowedRoles.includes(userRole)) {
    if (userRole === 'tourist') {
      return <Navigate to="/Unauthorized" />;
    } else {
      return <Navigate to="/HomepageTourist" />;
    }
  }

  return children;
};

export default PrivateRoute;
