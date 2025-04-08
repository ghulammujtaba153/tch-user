
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import NavLayout from './layouts/NavLayout';
import Verification from './pages/Verification';
import ForgetPassword from './pages/ForgetPassword';
import NewPassword from './pages/NewPassword';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import CreateCampaignForm from './pages/CampaignCreate';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/userContext';

import EditCampaign from './components/EditCampaign';

import MainDashboard from './pages/dashboard/main';
import CampaignerDashboardLayout from './layouts/DashboardLayout';
import MyCampaigns from './pages/dashboard/MyCampaigns';
import Donations from './pages/dashboard/Donations';
import Profile from './pages/dashboard/Profile';
import EditProfile from './pages/dashboard/EditProfile';
import CreateCampaign from './pages/dashboard/CreateCampaign';
import ProtectedRoute from './protectedRoutes/ProtectedRoutes';
import Unauthorized from './pages/Unauthorized';
// import EditCampaignPage from './pages/dashboard/EditCampaignPage';
import EmailVerification from './pages/EmailVerification';
import "./App.css";
import HowWorks from './pages/HowWorks';
import About from './pages/About';
import FAQs from './pages/FAQs';
import FeesPayouts from './pages/Fees&Payouts';
import Support from './pages/Support';



function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
        theme="light" 
      />

      <Routes>
        <Route path='/unauthorized' element={<Unauthorized />} />

        <Route path="/" element={<NavLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/admin/signin" element={<AdminSignIn />} /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/verification/:id" element={<Verification />} />
          <Route path="/email/verification" element={<EmailVerification />} />
          <Route path="/newpassword/:id" element={<NewPassword />} />
          <Route path="/home/campaigns" element={<Campaigns />} />
          <Route path="/home/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/home/campaigns/create" element={<CreateCampaignForm />} />

          <Route path="/works" element={<HowWorks/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/faqs" element={<FAQs/>} />
          <Route path="/fees" element={<FeesPayouts/>} />
          <Route path="/support" element={<Support/>}/>

        </Route>
        



        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/dashboard" element={<CampaignerDashboardLayout/>}>
            <Route path='overview' element={<MainDashboard />} />
            <Route path="campaigns" element={<MyCampaigns />} />
            <Route path="donations" element={<Donations />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="campaigns/create" element={<CreateCampaign />} />
            <Route path="campaigns/:id" element={<CampaignDetails />} />
            <Route path='campaigns/:id/edit' element={<EditCampaign />} />
          </Route>
        </Route>


        <Route path='*' element={<Navigate to="/" />}/>


      </Routes>
    </BrowserRouter>

    </AuthProvider>
    
  );
}

export default App;
