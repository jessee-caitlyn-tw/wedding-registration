import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom"
import App from './App';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import './index.css'
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        <GoogleReCaptchaProvider
            reCaptchaKey="6LcnSoQkAAAAAOAa4oV1Gbnwi8ezK-Oq7JpgoDR9"
            scriptProps={{ async: true, defer: true, appendTo: 'body' }}
        >
            <HashRouter>
                <App />
            </HashRouter>
        </GoogleReCaptchaProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

console.log("%c🥺不可以壞壞", "font-size: 64px;");