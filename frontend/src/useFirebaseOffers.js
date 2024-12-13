import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';  // Make sure you import the Firestore instance

const useFirebaseOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      const offersCollection = collection(db, 'offers');
      const offerSnapshot = await getDocs(offersCollection);
      const offersList = offerSnapshot.docs.map((doc) => doc.data());
      setOffers(offersList);
      setLoading(false);
    };

    fetchOffers();
  }, []);

  // src/hooks/useFirebaseOffers.js
useEffect(() => {
  const fetchOffers = async () => {
    const offersCollection = collection(db, 'offers');
    const offerSnapshot = await getDocs(offersCollection);
    const offersList = offerSnapshot.docs.map((doc) => doc.data());
    console.log(offersList);  // Check the output in the console
    setOffers(offersList);
    setLoading(false);
  };

  fetchOffers();
}, []);

  return { offers, loading };
};

export default useFirebaseOffers;