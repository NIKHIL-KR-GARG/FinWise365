import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthenticationGuard } from './components/authentication/authentication-guard';

import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import LoginCallback from './components/authentication/login-callback';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import Assets from './pages/Assets/Assets';
import Expenses from './pages/Expenses/Expenses';
import Dreams from './pages/Dreams/Dreams';
import Cashflows from './pages/Cashflows/Cashflows';
import Incomes from './pages/Incomes/Incomes';
import CashflowComparison from './pages/CashflowComparison/CashflowComparison';
import ContactUs from './pages/ContactUs/ContactUs';
import AboutUs from './pages/AboutUs/AboutUs';
import HelpCentre from './pages/HelpCentre/HelpCentre';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import AdminFunctions from './pages/AdminFunctions/AdminFunctions';
import Simulations from './pages/Simulations/Simulations';
import DisclaimerAndPolicy from './pages/DisclaimerAndPolicy/DisclaimerAndPolicy';
import UserManagement from './pages/UserManagement/UserManagement';
import GoalsPrioritization from './pages/GoalsPrioritization/GoalsPrioritization';
import AssetsGoalsMapping from './pages/AssetsGoalsMapping/AssetsGoalsMapping';

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<AuthenticationGuard component={Home} />} />
        <Route path='/logincallback' element={<AuthenticationGuard component={LoginCallback} />} />
        <Route path='/accountsettings' element={<AuthenticationGuard component={AccountSettings} />} />
        <Route path='/incomes' element={<AuthenticationGuard component={Incomes} />} />
        <Route path='/assets' element={<AuthenticationGuard component={Assets} />} />
        <Route path='/expenses' element={<AuthenticationGuard component={Expenses} />} />
        <Route path='/dreams' element={<AuthenticationGuard component={Dreams} />} />
        <Route path='/cashflows' element={<AuthenticationGuard component={Cashflows} />} />
        <Route path='/cashflowcomparison' element={<AuthenticationGuard component={CashflowComparison} />} />
        <Route path='/contactus' element={<ContactUs />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/helpcentre' element={<HelpCentre />} />
        <Route path='/comingsoon' element={<ComingSoon />} />
        <Route path='/disclaimerandpolicy' element={<DisclaimerAndPolicy />} />
        <Route path='/adminfunctions' element={<AuthenticationGuard component={AdminFunctions} />} />
        <Route path='/simulations' element={<AuthenticationGuard component={Simulations} />} />
        <Route path='/usermanagement' element={<AuthenticationGuard component={UserManagement} />} />
        <Route path='/goalsprioritization' element={<AuthenticationGuard component={GoalsPrioritization} />} />
        <Route path='/assetsgoalsmapping' element={<AuthenticationGuard component={AssetsGoalsMapping} />} />
      </Routes>
    </>
  );
}


export default App;