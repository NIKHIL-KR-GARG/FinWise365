import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

//const domain = process.env.REACT_APP_AUTH0_DOMAIN;
//const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
//const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;

const domain = "dev-finwise365.us.auth0.com";
const clientId = "mT9TX9EUVQw06Z58HbzJjYXvdVva8Hva";
// const redirectUri = "http://localhost:3000/logincallback";
const redirectUri = "https://www.finwise365.com/logincallback";

import { Auth0Provider } from '@auth0/auth0-react';

document.addEventListener('DOMContentLoaded', () => {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: redirectUri,
          }}
        >
          <App />
        </Auth0Provider>
      </BrowserRouter>
    </StrictMode>
  );
});
