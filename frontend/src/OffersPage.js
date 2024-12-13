import { Link } from 'react-router-dom';
import { GiCommercialAirplane } from "react-icons/gi";
import { MdLocalOffer } from "react-icons/md";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { MdFastfood } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase'; // Make sure you import Firebase auth and db configuration
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { GoArrowLeft } from 'react-icons/go';
import Loader from './Loader';
import { LiaHotelSolid } from "react-icons/lia";


const OffersPage = () => {

    const icons =[(<GiCommercialAirplane />),(<MdLocalOffer />),(<PiBuildingApartmentFill />),(<MdFastfood />),(<LiaHotelSolid />
    )];

    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
  
    // Fetch user role when the component mounts
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Fetch user role from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const role = userDoc.data().role; // Assuming 'role' is stored in Firestore
              setUserRole(role); // Set the user role state
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        }
        setLoading(false); // Set loading to false once we finish fetching the role
      });
  
      // Cleanup on component unmount
      return () => unsubscribe();
    }, []);
  
    // Handle loading state
    if (loading) {
      return <div><Loader /></div>; // You can display a loading spinner or message
    }
  
    // Set the previous page path based on the user role
    let previousPage;
    if (userRole === "partner") {
      previousPage = "/HomepagePartner"; // Path for partner
    } else if (userRole === "tourist") {
      previousPage = "/HomepageTourist"; // Path for tourist
    } else {
      previousPage = "/"; // Default path if no role or unknown role
    }
    let Restaurents;
    if(userRole==='partner'){
      Restaurents ="DisplayRestaurents";
    }
    else if(userRole==='tourist'){
      Restaurents ='DisplayRestaurents'
    }
    const Offers={"1":{"name":"عروض سايح","Link":"SaihOffer"},"2":{"name":"عروض سياحية","Link":"Offerschoose"},"3":{"name":"وكالات","Link":"Agencies"},"4":{"name":"مطاعم","Link":Restaurents},"5":{"name":"فنادق","Link":"Hotels"} }

  return (
    <div className="bg-[rgb(0,176,176)] w-full h-screen flex flex-col justify-center items-center">
        

        <h1 className='text-center text-7xl font-bold mb-20'>استكشف عروضنا</h1>
        <div className='w-full max-w-7xl h-max bg-gray-100 rounded-3xl flex-row flex justify-between items-center p-20'>
            {Object.keys(Offers).map((offerKey, idx) => {
            const offer = Offers[offerKey];
            const icon = icons[idx]; // Get the corresponding icon from the icons array

            return (
                <div key={idx} className="text-slate-100 p-">
                <Link to={`/${offer.Link}`} className="text-md font-bold flex flex-col px-6 py-8 whitespace-nowrap justify-center hover:text-[rgb(0,176,176)] text-gray-900 text-3xl w-min border-2 rounded-3xl items-center">
                    <span className="mb-4 text-7xl">{icon}</span> {/* Display icon */}
                    {offer.name}
                </Link>
                </div>
            );
            })}
        </div>
    </div>
  )
}

export default OffersPage;
