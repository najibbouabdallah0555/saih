import React, { useState, useEffect } from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { Link, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { MdSpaceDashboard } from 'react-icons/md';
import { FaBars, FaTimes } from 'react-icons/fa';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({}); // Holds user details
  const [bookings, setBookings] = useState([]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());

            // Fetch bookings if the user is a partner
            if (userDoc.data().role === 'partner') {
              const bookingsCollection = collection(db, 'bookings');
              const unsubscribeBookings = onSnapshot(bookingsCollection, (snapshot) => {
                const fetchedBookings = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setBookings(fetchedBookings);
              });

              return () => unsubscribeBookings();
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData({});
        setBookings([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleHamburger = () => setIsHamburgerOpen(!isHamburgerOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData({});
      setBookings([]);
      setRedirect(true);
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <nav
        className={`flex fixed z-10 top-0 right-0 left-0 items-center justify-between mx-auto w-full px-4 py-3 transition duration-300 ${
          isScrolled ? 'backdrop-blur-xl bg-opacity-70' : 'bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center p-0 max-w-7xl">
          <Link
            to={userData.role === 'partner' && '/PartnerDashboard'}
            className="text-3xl mx-10 hover:text-[rgb(0,176,176)]"
          >
            {userData.role === 'partner' && (
              <div className="flex flex-col justify-center items-center">
                <MdSpaceDashboard />
                <p className="text-lg">لوحة القيادة</p>
              </div>
            )}
          </Link>
          <Link to={userData.role === 'partner' ? '/HomepagePartner' : '/'}>
            <div className="bg-logo-image bg-cover bg-center w-36 h-12"></div>
          </Link>
        </div>

        <button
          onClick={toggleHamburger}
          className="text-white text-2xl md:hidden focus:outline-none"
        >
          {isHamburgerOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className="hidden md:flex items-center space-x-6 max-w-7xl">
          <a href="/About" className="bg-black text-white py-3 px-6 mx-4 rounded-lg hover:bg-[rgb(0,176,176)] transition">
            عن
          </a>
          <a href="/Contact" className="bg-black text-white py-3 px-6 rounded-lg hover:bg-[rgb(0,176,176)] transition">
            تواصل
          </a>

          {user ? (
            <>
              <div className="flex items-center space-x-4">
                {userData.profileImage && (
                  <img
                    src={userData.profileImage}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full border-2 border-[rgb(0,176,176)]"
                  />
                )}
                <span className="text-white text-lg">
                  مرحبًا {userData.name || userData.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-black text-white py-3 px-6 rounded-lg shadow-lg hover:bg-red-500 transition"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <a
                href="/SignUpPage"
                className="bg-black text-white py-3 px-6 rounded-lg hover:bg-[rgb(0,176,176)] transition flex items-center"
              >
                <BiLogInCircle className="mr-2" /> تسجيل
              </a>
              <a
                href="/LoginPage"
                className="bg-black text-white py-3 px-6 rounded-lg hover:bg-[rgb(0,176,176)] transition"
              >
                تسجيل الدخول
              </a>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
