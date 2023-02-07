import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom"
import App from './App';

import './index.css'
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

console.log("%c🥺不可以壞壞", "font-size: 64px;");