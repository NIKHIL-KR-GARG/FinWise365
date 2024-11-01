import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import LoginCallback from './components/authentication/login-callback';
import { AuthenticationGuard } from './components/authentication/authentication-guard';

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<AuthenticationGuard component={Home} />} />
        <Route path='/logincallback' element={<AuthenticationGuard component={LoginCallback} />} />
      </Routes>
    </>
  );
}


export default App;