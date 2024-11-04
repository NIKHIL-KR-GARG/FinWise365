import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthenticationGuard } from './components/authentication/authentication-guard';

import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import LoginCallback from './components/authentication/login-callback';
import AccountSettings from './pages/AccountSettings/AccountSettings';

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<AuthenticationGuard component={Home} />} />
        <Route path='/logincallback' element={<AuthenticationGuard component={LoginCallback} />} />
        <Route path='/accountsettings' element={<AuthenticationGuard component={AccountSettings} />} />
      </Routes>
    </>
  );
}


export default App;