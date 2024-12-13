import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Homepage from './Homepage';
import Ofr from './Ofr';
import Agencies from './Agencies';
import OfferDetailPage from './OfferDetailPage';
import SignUpPartner from './SignUpPartner';
import SignUpTourist from './SignUpTourist';
import SignUpPage from './SignUpPage';
import HomepagePartner from './HomepagePartner';
import CreateOffer from './CreateOffer';
import { auth } from './firebase'; // Adjust to your path
import { setPersistence, browserSessionPersistence } from 'firebase/auth';
import OfferManagement from './OfferManagement';
import EditOffer from './EditOffer';
import PrivateRoute from './PrivateRoute';
import Unauthorized from './Unauthorized';
import HomepageTourist from './HomepageTourist';
import OffersPage from './OffersPage';
import SaihOffer from './SaihOffer';
import PartnerOffers from './PartnerOffers';
import Restaurants from './Restaurants';
import BookingRequest from './BookingRequest';
import ManageRestaurants from './ManagaRestaurants';
import LoginPage from './LoginPage';
import LoginPartner from './LoginPartner';
import LoginTourist from './LoginTourist';
import DisplayRestaurants from './DisplayRestaurents';
import Mosques from './Mosques';
import Kibla from './Kibla'
import TouristAttractions from './TouristAttractions';
import Explore from './Explore';
import Offreschoose from './Offreschoose';
import HalaBookingRedirect from './halalBookingredirect';
import PartnerDashboard from './PartnerDashboard';
import Restaurents from './Restaurents';
import DisplayandEditRestaurant from './DisplayandEditRestaurant';
import TouristGuide from './TouristGuide';
import Contact from './Contact';
import About from './About';
import Hotels from './Hotels';
import Salat from './Salat';
import Prayes from './Prayes';


function App() {
  // Set auth persistence to session-based
setPersistence(auth, browserSessionPersistence)
.then(() => {
  console.log('Auth persistence set to session.');
})
.catch((error) => {
  console.error('Error setting persistence:', error);
});
  return (
    <Router>
      <Routes >
        <Route path='/Agencies' element={<Agencies />} />
        <Route path='/' element={<Homepage />} />
        <Route path='/Ofr' element={<Ofr />} />
        <Route path="/offer/:id" element={<OfferDetailPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/signup-tourist" element={<SignUpTourist />} />
        <Route path="/signup-partner" element={<SignUpPartner />} />
        <Route path='/HomepagePartner' element={<HomepagePartner />} />
        
        <Route path="/EditOffer/:id" element={<EditOffer />} />
        <Route
          path="/HomepageTourist"
          element={
            <PrivateRoute allowedRoles={['tourist']}>
                <HomepageTourist />
            </PrivateRoute>
          }
        />
         <Route
          path="/HomepagePartner"
          element={
            <PrivateRoute allowedRoles={['partner']}>
              <HomepagePartner />
            </PrivateRoute>
          } />
        <Route path="/Unauthorized" element={<Unauthorized />} />
        <Route path='/HomepageTourist' element={<HomepageTourist />} />
        <Route path="/OffersPage" element={<OffersPage />} />
        <Route path="/SaihOffer" element={<SaihOffer />} />
        <Route path="/PartnerOffers/:partnerId" element={<PartnerOffers />} />
        <Route path="/BookingRequest" element={<BookingRequest />} />
        <Route path='/LoginPage' element={<LoginPage/>}/>
        <Route path='/LoginPartner' element={<LoginPartner/>}/>
        <Route path='/LoginTourist' element={<LoginTourist/>} />
        <Route path='/DisplayRestaurents' element={<DisplayRestaurants/>} />
        <Route path='/Mosques' element={<Mosques/>} />
        <Route path='/Qibla' element={<Kibla />} />
        <Route path='/TouristAttractions' element={<TouristAttractions/>} /> 
        <Route path='/Explore' element={<Explore />} />
        <Route path='/Offerschoose' element={<Offreschoose/>} />
        <Route path='/Halalbookingredirect' element={<HalaBookingRedirect/>} />
        <Route path="/Restaurants/:id" element={<Restaurants />} />
        <Route path='/PartnerDashboard/' element={<PartnerDashboard/>} >
          <Route path='/PartnerDashboard/CreateOffer' element={<CreateOffer />} />
          <Route path="/PartnerDashboard/OfferManagement" element={<OfferManagement />} />
          <Route path="/PartnerDashboard/Restaurants/:id" element={<Restaurants />} />
          <Route path="/PartnerDashboard/ManageRestaurants" element={<ManageRestaurants />} />
          <Route path='/PartnerDashboard/DisplayandEditRestaurant' element={<DisplayandEditRestaurant />} />
          <Route path='/PartnerDashboard/Restaurents/:id' element={<Restaurents />} />
        </Route>
        <Route path='/TouristGuide' element={<TouristGuide />} />
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Hotels' element={<Hotels/>}/>
        <Route path='/Salat' element={<Salat/>}/>
        <Route path='/Prayes' element={<Prayes/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
