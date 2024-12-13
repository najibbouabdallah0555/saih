import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase'; // Import Firebase configuration
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loader from './Loader';

const Agencies = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const partnersQuery = query(collection(db, 'users'), where('role', '==', 'partner'));
        const querySnapshot = await getDocs(partnersQuery);
        const partnersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPartners(partnersData);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return  <div className='w-full h-full bg-[rgb(0,176,176)] absolute z-50 flex justify-center items-center'><Loader /></div>; // Add a spinner if necessary
  }

  return (
    <div className="bg-[rgb(0,176,176)] min-h-screen p-20 flex flex-col justify-center items-center">
        <div className='flex justify-center flex-col items-center rounded-3xl bg-gray-100 w-full h-full p-40'>
          <div className='w-full h-full max-w-7xl'>
            <h1 className="text-3xl font-bold text-center mb-20">استكشف وكالات شركائنا وعروضهم</h1>
          </div>
          <div className="flex flex-col gap-6 w-full self-center h-full max-w-5xl">
            {partners.map((partner) => (
              <Link
                key={partner.id}
                to={`/PartnerOffers/${partner.id}`}
                className="block bg-white rounded-lg shadow-lg p-4 hover:bg-blue-100 transition"
              >
                <h2 className="text-xl font-semibold">{partner.businessName || partner.email}</h2>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Agencies;
